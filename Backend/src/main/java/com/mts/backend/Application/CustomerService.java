package com.mts.backend.Application;

import com.mts.backend.Domain.Models.Customer;

import java.util.UUID;

public interface CustomerService {
    Customer getById(UUID id);
}