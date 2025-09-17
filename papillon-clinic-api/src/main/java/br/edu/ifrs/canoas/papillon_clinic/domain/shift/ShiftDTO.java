package br.edu.ifrs.canoas.papillon_clinic.domain.shift;

import java.time.LocalTime;

public record ShiftDTO(String id, String shift, LocalTime start_time, LocalTime end_time) {
}
