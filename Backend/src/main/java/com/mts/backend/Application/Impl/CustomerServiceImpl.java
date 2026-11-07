package com.mts.backend.Application.Impl;

import com.mts.backend.Application.CustomerService;
import com.mts.backend.Domain.Models.Customer;
import com.mts.backend.Domain.Repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    public CustomerServiceImpl(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Customer getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found: " + id));
    }
}