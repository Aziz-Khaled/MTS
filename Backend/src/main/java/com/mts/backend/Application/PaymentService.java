package com.mts.backend.Application;

import java.util.UUID;

public interface PaymentService {
    PaymentIntentResult createPaymentIntent(UUID reservationId);
    void handleWebhookEvent(String payload, String signatureHeader);

    record PaymentIntentResult(String clientSecret, java.math.BigDecimal depositAmount) {}
}