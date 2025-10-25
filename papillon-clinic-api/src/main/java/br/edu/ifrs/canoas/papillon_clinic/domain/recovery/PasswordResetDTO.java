package br.edu.ifrs.canoas.papillon_clinic.domain.recovery;

public record PasswordResetDTO(String token, String newPassword) {
}

