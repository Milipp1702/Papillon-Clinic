package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

public record ProfessionalDTO(String id, String name, String cpf, String crm, Speciality speciality, String phone_number, double discount) {
}
