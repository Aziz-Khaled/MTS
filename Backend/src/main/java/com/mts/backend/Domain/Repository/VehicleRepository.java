package com.mts.backend.Domain.Repository;

import com.mts.backend.Domain.Models.Vehicle;
import com.mts.backend.Domain.Models.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findAllByStatus(VehicleStatus status);
    boolean existsByVin(String vin);
}