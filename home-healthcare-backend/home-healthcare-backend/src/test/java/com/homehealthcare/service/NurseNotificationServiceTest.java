package com.homehealthcare.service;

import com.homehealthcare.entity.NurseNotification;
import com.homehealthcare.repository.NurseNotificationRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class NurseNotificationServiceTest {

    private final NurseNotificationRepository notificationRepository =
            mock(NurseNotificationRepository.class);
    private final NurseNotificationService notificationService =
            new NurseNotificationService(notificationRepository);

    @Test
    void formatsTimeInPreviouslySavedNotificationsWithAmPm() {
        NurseNotification notification = notification(
                "New appointment assigned: Arulmurugan B - Nursing Care, 2026-10-09 at 11:30."
        );
        when(notificationRepository.findByNurseIdOrderByCreatedAtDesc(11L))
                .thenReturn(List.of(notification));

        List<NurseNotification> result =
                notificationService.getNotifications(11L);

        assertEquals(
                "New appointment assigned: Arulmurugan B - Nursing Care, 2026-10-09 at 11:30 AM.",
                result.get(0).getMessage()
        );
    }

    @Test
    void doesNotChangeNotificationAlreadyUsingAmPm() {
        NurseNotification notification = notification(
                "New appointment assigned: Arulmurugan B - Nursing Care, 2026-10-09 at 11:30 PM."
        );
        when(notificationRepository.findByNurseIdOrderByCreatedAtDesc(11L))
                .thenReturn(List.of(notification));

        List<NurseNotification> result =
                notificationService.getNotifications(11L);

        assertEquals(notification.getMessage(), result.get(0).getMessage());
    }

    @Test
    void formatsTimeWhenReturningMarkedNotification() {
        NurseNotification notification = notification(
                "New appointment assigned: Arulmurugan B - Nursing Care, 2026-10-09 at 11:30."
        );
        when(notificationRepository.findByIdAndNurseId(7L, 11L))
                .thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);

        NurseNotification result =
                notificationService.markAsRead(11L, 7L);

        assertEquals(
                "New appointment assigned: Arulmurugan B - Nursing Care, 2026-10-09 at 11:30 AM.",
                result.getMessage()
        );
    }

    private NurseNotification notification(String message) {
        NurseNotification notification = new NurseNotification();
        notification.setMessage(message);
        return notification;
    }
}
