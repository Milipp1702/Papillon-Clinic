package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

public record AppointmentDetailsDTO(String id, LocalDateTime appointment_date, String payment_type, LocalDate paymentDate, String observation, String professionalId, String patientId, String appointmentTypeId, AppointmentFrequencyDTO frequency, String specialtyId, String professionalName) {
}
