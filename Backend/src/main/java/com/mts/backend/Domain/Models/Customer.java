package com.mts.backend.Domain.Models;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
public class Customer {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String drivingLicenseNumber;
    private LocalDate dateOfBirth;
    private boolean blacklisted;

    public Customer() {
    }

    public Customer(UUID id, String firstName, String lastName, String email, String phone,
                    String drivingLicenseNumber, LocalDate dateOfBirth, boolean blacklisted) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.drivingLicenseNumber = drivingLicenseNumber;
        this.dateOfBirth = dateOfBirth;
        this.blacklisted = blacklisted;
    }



}