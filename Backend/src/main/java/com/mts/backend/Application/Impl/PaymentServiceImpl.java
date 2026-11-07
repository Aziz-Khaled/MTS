package com.mts.backend.Application.Impl;

import com.mts.backend.Application.CurrentUserService;
import com.mts.backend.Application.PaymentService;
import com.mts.backend.Domain.Models.Customer;
import com.mts.backend.Domain.Models.Reservation;
import com.mts.backend.Domain.Models.ReservationStatus;
import com.mts.backend.Domain.Models.Vehicle;
import com.mts.backend.Domain.Repository.ReservationRepository;
import com.mts.backend.Domain.Repository.VehicleRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final ReservationRepository reservationRepository;
    private final VehicleRepository vehicleRepository;
    private final CurrentUserService currentUserService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    public PaymentServiceImpl(ReservationRepository reservationRepository,
                              VehicleRepository vehicleRepository,
                              CurrentUserService currentUserService) {
        this.reservationRepository = reservationRepository;
        this.vehicleRepository = vehicleRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public PaymentIntentResult createPaymentIntent(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NoSuchElementException("Reservation not found: " + reservationId));

        Customer currentCustomer = currentUserService.getCurrentCustomer();
        if (!reservation.getCustomerId().equals(currentCustomer.getId())) {
            throw new SecurityException("You cannot pay for another customer's reservation");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("This reservation is no longer awaiting payment");
        }

        if (reservation.isPaymentExpired()) {
            throw new IllegalStateException("The payment window for this reservation has expired");
        }

        try {
            // Reuse the same Stripe PaymentIntent if one already exists for this reservation
            // (e.g. the customer refreshed the payment page) instead of creating a duplicate.
            if (reservation.getStripePaymentIntentId() != null) {
                PaymentIntent existing = PaymentIntent.retrieve(reservation.getStripePaymentIntentId());
                if (!"succeeded".equals(existing.getStatus()) && !"canceled".equals(existing.getStatus())) {
                    return new PaymentIntentResult(existing.getClientSecret(), reservation.getDepositAmount());
                }
            }

            long amountInCents = reservation.getDepositAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("eur")
                    .putMetadata("reservationId", reservation.getId().toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            reservation.setStripePaymentIntentId(intent.getId());
            reservationRepository.save(reservation);

            return new PaymentIntentResult(intent.getClientSecret(), reservation.getDepositAmount());

        } catch (StripeException e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

    @Override
    public void handleWebhookEvent(String payload, String signatureHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new SecurityException("Invalid Stripe webhook signature");
        }

        if (!"payment_intent.succeeded".equals(event.getType())) {
            return; // ignore all other event types for now
        }

        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new IllegalStateException("Could not deserialize webhook payload"));

        Map<String, String> metadata = intent.getMetadata();
        String reservationIdStr = metadata.get("reservationId");
        if (reservationIdStr == null) return;

        UUID reservationId = UUID.fromString(reservationIdStr);
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NoSuchElementException("Reservation not found: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            return; // already confirmed/cancelled, ignore duplicate webhook delivery
        }

        reservation.markDepositPaid(intent.getId());
        reservation.confirm();
        reservationRepository.save(reservation);

        Vehicle vehicle = vehicleRepository.findById(reservation.getVehicleId())
                .orElseThrow(() -> new IllegalStateException("Vehicle not found: " + reservation.getVehicleId()));
        vehicle.markAsReserved();
        vehicleRepository.save(vehicle);
    }
}