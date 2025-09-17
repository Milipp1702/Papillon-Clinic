package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

import java.time.LocalDate;
import java.time.LocalTime;

public record AvailableSlot(LocalDate date, LocalTime time,String professionalId, String professionalName, String specialtyId) {}
