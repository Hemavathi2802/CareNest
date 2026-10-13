
package com.homehealthcare.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    @Value("${app.brevo.api-key:}")
    private String apiKey;

    @Value("${app.brevo.from-email:}")
    private String fromEmail;

    @Value("${app.brevo.from-name:CareNest}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void send(String to, String subject, String body) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "BREVO_API_KEY is not configured."
            );
        }

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException(
                    "BREVO_FROM_EMAIL is not configured."
            );
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            Map<String, Object> payload = Map.of(
                    "sender", Map.of(
                            "name", fromName,
                            "email", fromEmail
                    ),
                    "to", List.of(
                            Map.of("email", to)
                    ),
                    "subject", subject,
                    "textContent", body
            );

            HttpEntity<String> request = new HttpEntity<>(
                    objectMapper.writeValueAsString(payload),
                    headers
            );

            restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    request,
                    String.class
            );

        } catch (RestClientResponseException exception) {
            throw new IllegalStateException(
                    "Brevo email sending failed: HTTP "
                            + exception.getStatusCode().value(),
                    exception
            );
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to send email through Brevo.",
                    exception
            );
        }
    }
}
