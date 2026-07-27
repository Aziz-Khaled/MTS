package com.mts.backend.Web.DTO;

import com.mts.backend.Domain.Models.*;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class VehicleResponseDTO {
    private UUID id;
    private String brand;
    private String model;
    private int year;
    private VehicleCategory category;
    private TransmissionType transmission;
    private FuelType fuel;
    private int seats;
    private String vin;
    private String registrationNumber;
    private BigDecimal dailyPrice;
    private VehicleStatus status;
    private UUID agencyId;
}