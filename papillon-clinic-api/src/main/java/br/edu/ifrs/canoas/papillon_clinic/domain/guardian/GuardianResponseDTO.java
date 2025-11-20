package br.edu.ifrs.canoas.papillon_clinic.domain.guardian;

public record GuardianResponseDTO(String id, String name, String cpf, String relationship, boolean isMain, String phoneNumber, String observation) {
}
