package br.edu.ifrs.canoas.papillon_clinic.domain.user;

public record LoginResponseDTO(String id, String user, UserRole role, String token) {
}
