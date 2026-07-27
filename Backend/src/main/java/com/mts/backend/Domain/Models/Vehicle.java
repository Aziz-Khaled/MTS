package com.mts.backend.Domain.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Setter
@Getter
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String brand;
    private String model;
    private int year;

    @Enumerated(EnumType.STRING)
    private VehicleCategory category;

    @Enumerated(EnumType.STRING)
    private TransmissionType transmission;

    @Enumerated(EnumType.STRING)
    private FuelType fuel;

    private int seats;

    @Column(unique = true)
    private String vin;

    private String registrationNumber;
    private BigDecimal dailyPrice;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private UUID agencyId;

    @ElementCollection
    @CollectionTable(
            name = "vehicle_images",
            joinColumns = @JoinColumn(name = "vehicle_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrl = new ArrayList<>();

    public Vehicle() {
    }

    public Vehicle(UUID id, String brand, String model, int year, VehicleCategory category,
                   TransmissionType transmission, FuelType fuel, int seats, String vin,
                   String registrationNumber, BigDecimal dailyPrice, VehicleStatus status,
                   UUID agencyId, List<String> imageUrl) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.category = category;
        this.transmission = transmission;
        this.fuel = fuel;
        this.seats = seats;
        this.vin = vin;
        this.registrationNumber = registrationNumber;
        this.dailyPrice = dailyPrice;
        this.status = status;
        this.agencyId = agencyId;
        this.imageUrl = imageUrl != null ? imageUrl : new ArrayList<>();
    }

    public boolean isBookable() {
        return status == VehicleStatus.AVAILABLE;
    }

    public void markAsReserved() {
        if (!isBookable()) {
            throw new IllegalStateException("Vehicle " + id + " cannot be reserved: current status is " + status);
        }
        this.status = VehicleStatus.RESERVED;
    }

    public void markAsAvailable() {
        this.status = VehicleStatus.AVAILABLE;
    }
}