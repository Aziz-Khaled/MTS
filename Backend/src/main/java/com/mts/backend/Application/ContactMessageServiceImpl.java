package com.mts.backend.Application;

import com.mts.backend.Application.ContactMessageService;
import com.mts.backend.Domain.Models.ContactMessage;
import com.mts.backend.Domain.Repository.ContactMessageRepository;
import com.mts.backend.Web.DTO.ContactMessageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository repository;

    public ContactMessageServiceImpl(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Override
    public ContactMessage create(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage(
                request.getName(), request.getEmail(), request.getSubject(), request.getMessage()
        );
        return repository.save(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessage> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public ContactMessage markAsRead(UUID id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Message not found: " + id));
        message.setRead(true);
        return repository.save(message);
    }
}