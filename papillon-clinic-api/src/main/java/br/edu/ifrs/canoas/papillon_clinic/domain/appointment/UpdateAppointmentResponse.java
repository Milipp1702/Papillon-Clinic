package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDateTime;
import java.util.List;

public record UpdateAppointmentResponse(String appointmentId, List<LocalDateTime> skippedDateTimes) {
}
