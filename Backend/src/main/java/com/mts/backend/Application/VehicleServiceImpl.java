package com.mts.backend.Application;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mts.backend.Application.VehicleService;
import com.mts.backend.Domain.Exceptions.VehicleNotFoundException;
import com.mts.backend.Domain.Models.Vehicle;
import com.mts.backend.Domain.Models.VehicleStatus;
import com.mts.backend.Domain.Repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repository;
    private final Cloudinary cloudinary;

    public VehicleServiceImpl(VehicleRepository repository, Cloudinary cloudinary) {
        this.repository = repository;
        this.cloudinary = cloudinary;
    }

    @Override
    public Vehicle create(Vehicle vehicle) {
        if (repository.existsByVin(vehicle.getVin())) {
            throw new IllegalArgumentException("A vehicle with VIN " + vehicle.getVin() + " already exists");
        }
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return repository.save(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public Vehicle getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> getAllAvailable() {
        return repository.findAllByStatus(VehicleStatus.AVAILABLE);
    }

    @Override
    public Vehicle update(UUID id, Vehicle updated) {
        Vehicle existing = getById(id);
        existing.setBrand(updated.getBrand());
        existing.setModel(updated.getModel());
        existing.setYear(updated.getYear());
        existing.setCategory(updated.getCategory());
        existing.setTransmission(updated.getTransmission());
        existing.setFuel(updated.getFuel());
        existing.setSeats(updated.getSeats());
        existing.setVin(updated.getVin());
        existing.setRegistrationNumber(updated.getRegistrationNumber());
        existing.setDailyPrice(updated.getDailyPrice());
        existing.setAgencyId(updated.getAgencyId());
        return repository.save(existing);
    }

    @Override
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new VehicleNotFoundException(id);
        }
        repository.deleteById(id);
    }

    @Override
    public Vehicle addImages(UUID id, MultipartFile[] files) {
        Vehicle vehicle = getById(id);
        for (MultipartFile file : files) {
            try {
                Map<?, ?> result = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap("folder", "mts/vehicles")
                );
                String secureUrl = (String) result.get("secure_url");
                vehicle.getImageUrl().add(secureUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image to Cloudinary", e);
            }
        }
        return repository.save(vehicle);
    }
}