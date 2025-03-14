package br.edu.ifrs.canoas.papillon_clinic.domain.guardian;

public record GuardianDTO(String name, String cpf, String relationship, boolean isMain, String phoneNumber) {
}
