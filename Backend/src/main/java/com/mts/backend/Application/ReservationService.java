package com.mts.backend.Application;

import com.mts.backend.Domain.Models.Reservation;

import java.util.List;
import java.util.UUID;

public interface ReservationService {
    Reservation create(UUID vehicleId, UUID pickupAgencyId, UUID returnAgencyId,
                       java.time.LocalDate pickupDate, java.time.LocalDate returnDate);
    Reservation getById(UUID id);
    List<Reservation> getMine();
    List<Reservation> getAll();
    Reservation confirm(UUID id);
    Reservation cancel(UUID id);
    Reservation complete(UUID id);
}