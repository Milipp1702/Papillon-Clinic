package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.time.LocalDate;

public record AppointmentFrequencyDTO(String id,LocalDate end_date, Frequency frequency, Integer frequency_interval) {
}
