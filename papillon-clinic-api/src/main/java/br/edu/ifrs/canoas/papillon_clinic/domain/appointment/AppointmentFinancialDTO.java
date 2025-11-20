package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AppointmentFinancialDTO(LocalDateTime appointmentDate, String patientName, String professionalName, String appointmentType, String specialtyName, BigDecimal amount, Long isPaid, BigDecimal amountProfessional) {

}
