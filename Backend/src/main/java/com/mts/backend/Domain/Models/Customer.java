package com.mts.backend.Domain.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Setter
@Getter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String phone;
    private String drivingLicenseNumber;
    private LocalDate dateOfBirth;
    private boolean blacklisted;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Customer() {
    }

    public Customer(UUID id, String firstName, String lastName, String email, String phone,
                    String drivingLicenseNumber, LocalDate dateOfBirth, boolean blacklisted,
                    String password, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.drivingLicenseNumber = drivingLicenseNumber;
        this.dateOfBirth = dateOfBirth;
        this.blacklisted = blacklisted;
        this.password = password;
        this.role = role;
    }
}