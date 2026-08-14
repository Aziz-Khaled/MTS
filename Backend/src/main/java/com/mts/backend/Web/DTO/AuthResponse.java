package com.mts.backend.Web.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}