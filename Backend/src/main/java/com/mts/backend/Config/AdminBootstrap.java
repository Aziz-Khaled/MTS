package com.mts.backend.Config;

import com.mts.backend.Domain.Models.Customer;
import com.mts.backend.Domain.Models.Role;
import com.mts.backend.Domain.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class AdminBootstrap {

    @Bean
    public CommandLineRunner createAdminIfMissing(
            CustomerRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${admin.email}") String adminEmail,
            @Value("${admin.password}") String adminPassword
    ) {
        return args -> {
            if (repository.existsByEmail(adminEmail)) return;

            Customer admin = new Customer();
            admin.setFirstName("MTS");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("00000000");
            admin.setDrivingLicenseNumber("N/A");
            admin.setDateOfBirth(LocalDate.of(1990, 1, 1));
            admin.setBlacklisted(false);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);

            repository.save(admin);
            System.out.println("Bootstrapped admin account: " + adminEmail);
        };
    }
}