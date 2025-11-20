package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,String> {
    List<Appointment> findByAppointmentDateBetween(LocalDateTime firstDayOfMonth, LocalDateTime lastDayOfMonth);

    List<Appointment> findByFrequency_IdAndAppointmentDateAfter(String frequencyId, LocalDateTime date);

    List<Appointment> findByProfessional_IdIn(List<String> professionalIds);
}
