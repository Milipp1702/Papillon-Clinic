package br.edu.ifrs.canoas.papillon_clinic.domain.patient;

public record PatientResponseDTO(String id, String name,
                                 Integer age, String guardian) {
}
