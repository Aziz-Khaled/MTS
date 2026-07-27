package com.mts.backend.Application;

import com.mts.backend.Domain.Models.Vehicle;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface VehicleService {
    Vehicle create(Vehicle vehicle);
    Vehicle getById(UUID id);
    List<Vehicle> getAll();
    List<Vehicle> getAllAvailable();
    Vehicle update(UUID id, Vehicle updated);
    void delete(UUID id);
    Vehicle addImages(UUID id, MultipartFile[] files);
}