package com.mts.backend.Application;

import com.mts.backend.Domain.Models.ContactMessage;
import com.mts.backend.Web.DTO.ContactMessageRequest;

import java.util.List;
import java.util.UUID;

public interface ContactMessageService {
    ContactMessage create(ContactMessageRequest request);
    List<ContactMessage> getAll();
    ContactMessage markAsRead(UUID id);
}