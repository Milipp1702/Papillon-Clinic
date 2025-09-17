package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalWorkday;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProfessionalWorkdayRepository extends JpaRepository<ProfessionalWorkday,String> {
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM professional_workdays WHERE professional_id = :professionalId", nativeQuery = true)
    void deleteAllByProfessionalId(@Param("professionalId") String professionalId);

    @Query(value = "SELECT DISTINCT w.day FROM workdays w " +
            "WHERE w.id IN (" +
            "    SELECT pw.workday_id FROM professional_workdays pw " +
            "    WHERE pw.professional_id = :professionalId" +
            ") " +
            "AND w.day NOT IN (" +
            "    SELECT DISTINCT DAYNAME(a.appointment_date) FROM appointments a " +
            "    WHERE a.professional_id = :professionalId" +
            ")",
            nativeQuery = true)
    List<String> findAvailableDays(@Param("professionalId") String professionalId);

    @Query(value = "SELECT DISTINCT DATE(a.appointment_date) FROM appointments a " +
            "WHERE a.professional_id = :professionalId " +
            "AND DATE(a.appointment_date) BETWEEN DATE(NOW()) AND DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)",
            nativeQuery = true)
    List<String> findBookedAppointments(@Param("professionalId") String professionalId);

    @Query(value = "SELECT s.start_time, s.end_time FROM shifts s " +
            "JOIN professional_workdays pw ON pw.shift_id = s.id " +
            "JOIN workdays w ON pw.workday_id = w.id " +
            "WHERE pw.professional_id = :professionalId " +
            "AND w.day = :day",
            nativeQuery = true)
    List<Object[]> findShiftsForDay(@Param("professionalId") String professionalId,
                                                  @Param("day") String day);
}
