package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

import java.util.List;

public record ProfessionalDTO(String id, String name, String cpf, String crm, String specialty_id, String phone_number, double discount, List<ProfessionalWorkdayDTO> workdays) {
}
