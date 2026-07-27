package com.mts.backend.Web.Controller;

import com.mts.backend.Domain.Models.Vehicle;
import com.mts.backend.Application.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(vehicle));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAll(
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {
        return ResponseEntity.ok(availableOnly ? service.getAllAvailable() : service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable UUID id, @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(service.update(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Vehicle> addImages(
            @PathVariable UUID id,
            @RequestParam("files") MultipartFile[] files) {
        return ResponseEntity.ok(service.addImages(id, files));
    }
}