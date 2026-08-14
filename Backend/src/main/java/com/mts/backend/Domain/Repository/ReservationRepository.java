package com.mts.backend.Domain.Repository;

import com.mts.backend.Domain.Models.Reservation;
import com.mts.backend.Domain.Models.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findByCustomerId(UUID customerId);

    List<Reservation> findByVehicleId(UUID vehicleId);

    /**
     * Finds reservations for a given vehicle that overlap a proposed date range
     * and are still "active" (not cancelled). Used to block double-booking.
     * Overlap condition: existing.pickupDate < newReturnDate AND existing.returnDate > newPickupDate
     */
    @Query("""
        SELECT r FROM Reservation r
        WHERE r.vehicleId = :vehicleId
        AND r.status IN :activeStatuses
        AND r.pickupDate < :returnDate
        AND r.returnDate > :pickupDate
    """)
    List<Reservation> findOverlapping(
            @Param("vehicleId") UUID vehicleId,
            @Param("pickupDate") LocalDate pickupDate,
            @Param("returnDate") LocalDate returnDate,
            @Param("activeStatuses") List<ReservationStatus> activeStatuses
    );
}