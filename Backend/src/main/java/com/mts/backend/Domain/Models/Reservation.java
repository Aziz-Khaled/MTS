package com.mts.backend.Domain.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID vehicleId;
    private UUID customerId;
    private UUID pickupAgencyId;
    private UUID returnAgencyId;
    private LocalDate pickupDate;
    private LocalDate returnDate;
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    // Payment tracking
    private BigDecimal depositAmount;
    private boolean depositPaid;
    private LocalDateTime paymentDeadline;
    private String stripePaymentIntentId;

    public Reservation() {
    }

    public Reservation(UUID id, UUID vehicleId, UUID customerId, UUID pickupAgencyId, UUID returnAgencyId,
                       LocalDate pickupDate, LocalDate returnDate, BigDecimal totalPrice, ReservationStatus status) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.customerId = customerId;
        this.pickupAgencyId = pickupAgencyId;
        this.returnAgencyId = returnAgencyId;
        this.pickupDate = pickupDate;
        this.returnDate = returnDate;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public boolean hasValidDateRange() {
        return pickupDate != null && returnDate != null && returnDate.isAfter(pickupDate);
    }

    public long durationInDays() {
        if (!hasValidDateRange()) {
            throw new IllegalStateException("Cannot compute duration on an invalid date range");
        }
        return java.time.temporal.ChronoUnit.DAYS.between(pickupDate, returnDate);
    }

    public void confirm() {
        requireStatus(ReservationStatus.PENDING);
        this.status = ReservationStatus.CONFIRMED;
    }

    public void startRental() {
        requireStatus(ReservationStatus.CONFIRMED);
        this.status = ReservationStatus.ACTIVE;
    }

    public void cancel() {
        if (status == ReservationStatus.COMPLETED) {
            throw new IllegalStateException("A completed reservation cannot be cancelled");
        }
        this.status = ReservationStatus.CANCELLED;
    }

    public void complete() {
        requireStatus(ReservationStatus.ACTIVE);
        this.status = ReservationStatus.COMPLETED;
    }

    /** True once the payment window has closed without a deposit being paid. */
    public boolean isPaymentExpired() {
        return status == ReservationStatus.PENDING
                && !depositPaid
                && paymentDeadline != null
                && LocalDateTime.now().isAfter(paymentDeadline);
    }

    public void markDepositPaid(String paymentIntentId) {
        this.depositPaid = true;
        this.stripePaymentIntentId = paymentIntentId;
    }

    private void requireStatus(ReservationStatus expected) {
        if (this.status != expected) {
            throw new IllegalStateException("Expected status " + expected + " but was " + this.status);
        }
    }
}