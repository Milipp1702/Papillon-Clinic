package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentFinancialDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,String> {
    List<Appointment> findByAppointmentDateBetween(LocalDateTime firstDayOfMonth, LocalDateTime lastDayOfMonth);

    List<Appointment> findByFrequency_IdAndAppointmentDateAfterAndPaymentDateIsNull(String frequencyId, LocalDateTime date);

    List<Appointment> findByProfessional_IdIn(List<String> professionalIds);

    Page<Appointment> findByProfessional_UserId(String userId, Pageable pageable);

    List<Appointment> findByPatient_IdAndAppointmentDateAfterAndPaymentDateIsNull(String patientId, LocalDateTime dateTime);

    List<Appointment> findByProfessional_IdAndAppointmentDateAfterAndPaymentDateIsNull(String professionalId, LocalDateTime dateTime);

    Page<Appointment> findByProfessionalNameContainingIgnoreCaseOrPatientNameContainingIgnoreCaseOrAppointmentTypesNameContainingIgnoreCaseOrProfessionalSpecialtyNameContainingIgnoreCase(
            String professionalName,
            String patientName,
            String typeName,
            String specialtyDescription,
            Pageable pageable
    );

    Page<Appointment> findByPaymentDateIsNotNull(Pageable pageable);
    Page<Appointment> findByPaymentDateIsNull(Pageable pageable);

    @Query(value = """
    SELECT 
        a.appointment_date AS appointmentDate,
        pr.name AS professionalName,
        at.name AS appointmentType,
        s.name AS specialtyName,
        at.amount AS amount
    FROM appointments a
    JOIN professionals pr ON a.professional_id = pr.id
    JOIN specialties s ON pr.specialty_id = s.id
    JOIN appointment_types at ON a.appointment_type = at.id
    WHERE a.patient_id = :patientId
    """, nativeQuery = true)
    List<AppointmentFinancialDTO> findAppointmentsByPatient(
            @Param("patientId") String patientId);

}
