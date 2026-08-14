package com.mts.backend.Web.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @Email @NotBlank private String email;
    @NotBlank private String phone;
    @NotBlank private String drivingLicenseNumber;
    @NotNull private LocalDate dateOfBirth;
    @NotBlank @Size(min = 8) private String password;
}