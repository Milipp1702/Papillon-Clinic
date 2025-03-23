package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDateTime;

public record AppointmentFrequencyDTO(LocalDateTime end_date, Frequency frequency, Integer frequency_interval, boolean emailReminder, String appointment_id ) {
}
