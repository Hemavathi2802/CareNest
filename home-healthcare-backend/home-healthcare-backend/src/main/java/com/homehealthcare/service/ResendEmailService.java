package com.homehealthcare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class ResendEmailService {

    private static final String RESEND_EMAILS_URL = "https://api.resend.com/emails";

    private final RestClient restClient;
    private final String apiKey;
    private final String fromAddress;

    public ResendEmailService(
            RestClient.Builder restClientBuilder,
            @Value("${RESEND_API_KEY:}") String apiKey,
            @Value("${RESEND_FROM_EMAIL:CareNest <onboarding@resend.dev>}") String fromAddress) {
        this.restClient = restClientBuilder.baseUrl(RESEND_EMAILS_URL).build();
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
    }

    public void send(String recipient, String subject, String text) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is not configured.");
        }

        restClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(new ResendEmailRequest(fromAddress, List.of(recipient), subject, text))
                .retrieve()
                .toBodilessEntity();
    }

    private record ResendEmailRequest(
            String from,
            List<String> to,
            String subject,
            String text) {
    }
}
