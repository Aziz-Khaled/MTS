package com.mts.backend.Application.Impl;

import com.mts.backend.Application.CurrentUserService;
import com.mts.backend.Application.ReservationService;
import com.mts.backend.Domain.Exceptions.ReservationNotFoundException;
import com.mts.backend.Domain.Exceptions.VehicleUnavailableException;
import com.mts.backend.Domain.Models.*;
import com.mts.backend.Domain.Repository.ReservationRepository;
import com.mts.backend.Domain.Repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Value("${reservation.deposit-percentage}")
    private java.math.BigDecimal depositPercentage;

    @Value("${reservation.payment-window-hours}")
    private long paymentWindowHours;

    private static final List<ReservationStatus> ACTIVE_STATUSES = List.of(
            ReservationStatus.PENDING,
            ReservationStatus.CONFIRMED,
            ReservationStatus.IN_PREPARATION,
            ReservationStatus.ACTIVE
    );



    // Statuses where the vehicle has already been claimed by this reservation
    // (used to decide whether cancelling should release the vehicle back)
    private static final List<ReservationStatus> VEHICLE_CLAIMED_STATUSES = List.of(
            ReservationStatus.CONFIRMED,
            ReservationStatus.IN_PREPARATION,
            ReservationStatus.ACTIVE
    );

    private final ReservationRepository reservationRepository;
    private final VehicleRepository vehicleRepository;
    private final CurrentUserService currentUserService;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  VehicleRepository vehicleRepository,
                                  CurrentUserService currentUserService) {
        this.reservationRepository = reservationRepository;
        this.vehicleRepository = vehicleRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public Reservation create(UUID vehicleId, UUID pickupAgencyId, UUID returnAgencyId,
                              LocalDate pickupDate, LocalDate returnDate) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));

        if (!vehicle.isBookable()) {
            throw new VehicleUnavailableException(
                    "This vehicle is not currently available for booking (status: " + vehicle.getStatus() + ")"
            );
        }

        Reservation reservation = new Reservation();
        reservation.setVehicleId(vehicleId);
        reservation.setCustomerId(currentUserService.getCurrentCustomer().getId());
        reservation.setPickupAgencyId(pickupAgencyId);
        reservation.setReturnAgencyId(returnAgencyId);
        reservation.setPickupDate(pickupDate);
        reservation.setReturnDate(returnDate);
        reservation.setStatus(ReservationStatus.PENDING);

        if (!reservation.hasValidDateRange()) {
            throw new IllegalArgumentException("Return date must be after pickup date");
        }

        List<Reservation> overlapping = reservationRepository.findOverlapping(
                vehicleId, pickupDate, returnDate, ACTIVE_STATUSES
        );
        if (!overlapping.isEmpty()) {
            throw new VehicleUnavailableException(
                    "This vehicle is already booked for part of the selected date range"
            );
        }

        long days = reservation.durationInDays();
        reservation.setTotalPrice(vehicle.getDailyPrice().multiply(java.math.BigDecimal.valueOf(days)));

        reservation.setDepositAmount(
                reservation.getTotalPrice().multiply(depositPercentage).setScale(2, java.math.RoundingMode.HALF_UP)
        );
        reservation.setPaymentDeadline(java.time.LocalDateTime.now().plusHours(paymentWindowHours));
        reservation.setDepositPaid(false);
        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public Reservation getById(UUID id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getMine() {
        UUID customerId = currentUserService.getCurrentCustomer().getId();
        return reservationRepository.findByCustomerId(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation confirm(UUID id) {
        Reservation reservation = getById(id);
        reservation.confirm();
        reservationRepository.save(reservation);

        Vehicle vehicle = getVehicleOrThrow(reservation.getVehicleId());
        vehicle.markAsReserved();
        vehicleRepository.save(vehicle);

        return reservation;
    }

    @Override
    public Reservation startRental(UUID id) {
        Reservation reservation = getById(id);
        reservation.startRental();
        reservationRepository.save(reservation);
        // Vehicle is already RESERVED since confirm() — no status change needed here.
        return reservation;
    }

    @Override
    public Reservation cancel(UUID id) {
        Reservation reservation = getById(id);
        boolean vehicleWasClaimed = VEHICLE_CLAIMED_STATUSES.contains(reservation.getStatus());

        reservation.cancel();
        reservationRepository.save(reservation);

        if (vehicleWasClaimed) {
            Vehicle vehicle = getVehicleOrThrow(reservation.getVehicleId());
            vehicle.markAsAvailable();
            vehicleRepository.save(vehicle);
        }

        return reservation;
    }

    @Override
    public Reservation complete(UUID id) {
        Reservation reservation = getById(id);
        reservation.complete();
        reservationRepository.save(reservation);

        Vehicle vehicle = getVehicleOrThrow(reservation.getVehicleId());
        vehicle.markAsAvailable();
        vehicleRepository.save(vehicle);

        return reservation;
    }

    private Vehicle getVehicleOrThrow(UUID vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalStateException("Vehicle not found: " + vehicleId));
    }
}