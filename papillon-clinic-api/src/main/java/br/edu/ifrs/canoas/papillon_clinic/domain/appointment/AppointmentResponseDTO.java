package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDateTime;

public record AppointmentResponseDTO(String id, String professionalName, String patientName, String typeName, LocalDateTime appointmentDate, boolean isPaid, String specialtyName) {
}
