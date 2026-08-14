package com.mts.backend.Web.Controller;

import com.mts.backend.Application.ReservationService;
import com.mts.backend.Domain.Models.Reservation;
import com.mts.backend.Web.DTO.ReservationRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Reservation> create(@Valid @RequestBody ReservationRequest req) {
        Reservation created = service.create(
                req.getVehicleId(), req.getPickupAgencyId(), req.getReturnAgencyId(),
                req.getPickupDate(), req.getReturnDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Reservation>> getMine() {
        return ResponseEntity.ok(service.getMine());
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Reservation> confirm(@PathVariable UUID id) {
        return ResponseEntity.ok(service.confirm(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancel(@PathVariable UUID id) {
        return ResponseEntity.ok(service.cancel(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Reservation> complete(@PathVariable UUID id) {
        return ResponseEntity.ok(service.complete(id));
    }
}