package com.mts.backend.Web.Controller;

import com.mts.backend.Application.JwtService;
import com.mts.backend.Domain.Models.Customer;
import com.mts.backend.Domain.Models.Role;
import com.mts.backend.Domain.Repository.CustomerRepository;
import com.mts.backend.Web.DTO.AuthResponse;
import com.mts.backend.Web.DTO.LoginRequest;
import com.mts.backend.Web.DTO.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(CustomerRepository repository, PasswordEncoder passwordEncoder,
                          JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        if (repository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        Customer customer = new Customer();
        customer.setFirstName(req.getFirstName());
        customer.setLastName(req.getLastName());
        customer.setEmail(req.getEmail());
        customer.setPhone(req.getPhone());
        customer.setDrivingLicenseNumber(req.getDrivingLicenseNumber());
        customer.setDateOfBirth(req.getDateOfBirth());
        customer.setBlacklisted(false);
        customer.setPassword(passwordEncoder.encode(req.getPassword()));
        customer.setRole(Role.USER);

        Customer saved = repository.save(customer);
        String token = jwtService.generateToken(saved.getEmail(), saved.getId(), saved.getRole().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                token, saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail(), saved.getRole().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        Customer customer = repository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        String token = jwtService.generateToken(customer.getEmail(), customer.getId(), customer.getRole().name());

        return ResponseEntity.ok(new AuthResponse(
                token, customer.getId(), customer.getFirstName(), customer.getLastName(), customer.getEmail(), customer.getRole().name()
        ));
    }
}