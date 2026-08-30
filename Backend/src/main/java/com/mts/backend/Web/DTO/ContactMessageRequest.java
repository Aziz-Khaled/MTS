package com.mts.backend.Web.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactMessageRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank private String subject;
    @NotBlank private String message;
}