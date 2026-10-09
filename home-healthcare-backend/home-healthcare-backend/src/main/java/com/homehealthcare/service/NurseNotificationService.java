package com.homehealthcare.service;

import com.homehealthcare.entity.NurseNotification;
import com.homehealthcare.repository.NurseNotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NurseNotificationService {

    private static final Pattern NOTIFICATION_TIME =
            Pattern.compile("\\bat (\\d{1,2}:\\d{2})(?=\\.)");
    private static final DateTimeFormatter DISPLAY_TIME =
            DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    private final NurseNotificationRepository notificationRepository;

    public NurseNotificationService(
            NurseNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NurseNotification> getNotifications(Long nurseId) {
        return notificationRepository.findByNurseIdOrderByCreatedAtDesc(nurseId)
                .stream()
                .map(this::formatNotificationTime)
                .toList();
    }

    @Transactional
    public NurseNotification markAsRead(Long nurseId, Long notificationId) {
        NurseNotification notification = notificationRepository
                .findByIdAndNurseId(notificationId, nurseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found."
                ));
        notification.setRead(true);
        return formatNotificationTime(notificationRepository.save(notification));
    }

    private NurseNotification formatNotificationTime(
            NurseNotification notification) {
        String message = notification.getMessage();
        if (message == null) {
            return notification;
        }

        Matcher matcher = NOTIFICATION_TIME.matcher(message);
        if (!matcher.find()) {
            return notification;
        }

        try {
            String formattedTime = LocalTime.parse(matcher.group(1))
                    .format(DISPLAY_TIME);
            notification.setMessage(
                    matcher.replaceFirst(
                            Matcher.quoteReplacement("at " + formattedTime)
                    )
            );
        } catch (DateTimeParseException exception) {
            return notification;
        }

        return notification;
    }
}
