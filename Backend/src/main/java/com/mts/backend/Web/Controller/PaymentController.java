package com.mts.backend.Web.Controller;

import com.mts.backend.Application.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/reservations/{id}/intent")
    public ResponseEntity<Map<String, Object>> createIntent(@PathVariable UUID id) {
        PaymentService.PaymentIntentResult result = paymentService.createPaymentIntent(id);
        return ResponseEntity.ok(Map.of(
                "clientSecret", result.clientSecret(),
                "depositAmount", result.depositAmount()
        ));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            HttpServletRequest request,
            @RequestHeader("Stripe-Signature") String signatureHeader
    ) throws IOException {
        String payload;
        try (BufferedReader reader = request.getReader()) {
            payload = reader.lines().collect(Collectors.joining(System.lineSeparator()));
        }
        paymentService.handleWebhookEvent(payload, signatureHeader);
        return ResponseEntity.ok().build();
    }
}