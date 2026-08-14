package com.mts.backend.Web.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class ReservationRequest {
    @NotNull private UUID vehicleId;
    @NotNull private UUID pickupAgencyId;
    @NotNull private UUID returnAgencyId;
    @NotNull private LocalDate pickupDate;
    @NotNull private LocalDate returnDate;
}