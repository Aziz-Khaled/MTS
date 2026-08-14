package com.mts.backend.Application.Impl;

import com.mts.backend.Application.CurrentUserService;
import com.mts.backend.Application.ReservationService;
import com.mts.backend.Domain.Exceptions.ReservationNotFoundException;
import com.mts.backend.Domain.Exceptions.VehicleUnavailableException;
import com.mts.backend.Domain.Models.*;
import com.mts.backend.Domain.Repository.ReservationRepository;
import com.mts.backend.Domain.Repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private static final List<ReservationStatus> ACTIVE_STATUSES = List.of(
            ReservationStatus.PENDING,
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
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation cancel(UUID id) {
        Reservation reservation = getById(id);
        reservation.cancel();
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation complete(UUID id) {
        Reservation reservation = getById(id);
        reservation.complete();
        return reservationRepository.save(reservation);
    }
}