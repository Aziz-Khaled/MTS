package com.mts.backend.Application;

import com.mts.backend.Domain.Models.Reservation;
import com.mts.backend.Domain.Models.ReservationStatus;
import com.mts.backend.Domain.Repository.ReservationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReservationExpiryScheduler {

    private final ReservationRepository reservationRepository;

    public ReservationExpiryScheduler(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // Runs every 15 minutes
    @Scheduled(fixedRate = 15 * 60 * 1000)
    @Transactional
    public void cancelExpiredUnpaidReservations() {
        List<Reservation> expired = reservationRepository
                .findAllByStatusAndDepositPaidFalseAndPaymentDeadlineBefore(
                        ReservationStatus.PENDING, LocalDateTime.now()
                );

        for (Reservation reservation : expired) {
            reservation.cancel();
            reservationRepository.save(reservation);
            // No vehicle release needed: at PENDING the vehicle was never claimed
            // (status only flips to RESERVED on confirm(), i.e. successful payment).
        }

        if (!expired.isEmpty()) {
            System.out.println("Auto-cancelled " + expired.size() + " unpaid reservation(s) past their payment deadline.");
        }
    }
}