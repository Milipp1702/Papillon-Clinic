package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDate;

public record AppointmentResponseDTO(String id, String professionalName, String patientName, String typeName, LocalDate appointmentDate, boolean isPaid) {
}
