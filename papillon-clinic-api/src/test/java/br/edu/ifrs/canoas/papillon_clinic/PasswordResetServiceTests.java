package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.PasswordResetDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.PasswordResetToken;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.repository.PasswordResetTokenRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.UserRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.EmailService;
import br.edu.ifrs.canoas.papillon_clinic.service.PasswordResetService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PasswordResetServiceTests {

    @InjectMocks
    private PasswordResetService service;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    // -------------------------------------------------------------
    // TESTE 1 — generateRecoveryToken: usuário não existe
    // -------------------------------------------------------------
    @Test
    void generateRecoveryToken_ThrowsException_WhenUserNotFound() {
        when(userRepository.findUserByLogin("email@test.com"))
                .thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class, () ->
                service.generateRecoveryToken("email@test.com")
        );

        assertEquals("Usuário não encontrado!", ex.getMessage());
    }

    // -------------------------------------------------------------
    // TESTE 2 — generateRecoveryToken: sucesso
    // -------------------------------------------------------------
    @Test
    void generateRecoveryToken_Success() throws Exception {
        User user = new User();

        ReflectionTestUtils.setField(user, "login", "email@test.com");

        when(userRepository.findUserByLogin("email@test.com"))
                .thenReturn(Optional.of(user));

        when(tokenRepository.save(any(PasswordResetToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        doNothing().when(emailService).sendResetPasswordEmail(anyString(), anyString());

        assertDoesNotThrow(() ->
                service.generateRecoveryToken("email@test.com")
        );

        verify(tokenRepository, times(1)).save(any());
        verify(emailService, times(1)).sendResetPasswordEmail(eq("email@test.com"), anyString());
    }

    // -------------------------------------------------------------
    // TESTE 3 — resetPassword: token não encontrado
    // -------------------------------------------------------------
    @Test
    void resetPassword_ThrowsException_WhenTokenNotFound() {
        when(tokenRepository.findByToken("abc"))
                .thenReturn(Optional.empty());

        PasswordResetDTO dto = new PasswordResetDTO("abc", "senha123");

        Exception ex = assertThrows(Exception.class, () ->
                service.resetPassword(dto)
        );

        assertEquals("Token inválido ou expirado!", ex.getMessage());
    }

    // -------------------------------------------------------------
    // TESTE 4 — resetPassword: token expirado
    // -------------------------------------------------------------
    @Test
    void resetPassword_ThrowsException_WhenTokenExpired() {
        User user = new User();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpirationDate(LocalDateTime.now().minusMinutes(1));

        when(tokenRepository.findByToken("abc"))
                .thenReturn(Optional.of(token));

        PasswordResetDTO dto = new PasswordResetDTO("abc", "senha123");

        Exception ex = assertThrows(Exception.class, () ->
                service.resetPassword(dto)
        );

        assertEquals("Token expirado! Solicite novamente a troca de senha!", ex.getMessage());
    }

    // -------------------------------------------------------------
    // TESTE 5 — resetPassword: sucesso
    // -------------------------------------------------------------
    @Test
    void resetPassword_Success() throws Exception {
        User user = new User();
        ReflectionTestUtils.setField(user, "password", "oldPass");

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpirationDate(LocalDateTime.now().plusMinutes(30));

        when(tokenRepository.findByToken("abc"))
                .thenReturn(Optional.of(token));

        PasswordResetDTO dto = new PasswordResetDTO("abc", "novaSenha");

        assertDoesNotThrow(() -> service.resetPassword(dto));

        verify(userRepository, times(1)).save(user);
        verify(tokenRepository, times(1)).delete(token);
    }
}


