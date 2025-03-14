package br.edu.ifrs.canoas.papillon_clinic.domain.user;

import jakarta.validation.constraints.NotNull;

public record AuthenticationDTO(@NotNull String login, @NotNull String password) {
}
