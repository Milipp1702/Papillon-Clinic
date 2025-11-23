package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.UserRole;
import br.edu.ifrs.canoas.papillon_clinic.repository.UserRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.AuthorizationService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.lang.reflect.Field;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthorizationServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthorizationService authorizationService;

    // -----------------------------------------------------------------
    // TESTE 1 — loadUserByUsername: usuário encontrado
    // -----------------------------------------------------------------
    @Test
    void loadUserByUsername_ReturnsUser_WhenFound() {
        User user = new User("user@test.com", "1234", UserRole.USER);

        when(userRepository.findByLogin("user@test.com"))
                .thenReturn(Optional.of(user));

        var result = authorizationService.loadUserByUsername("user@test.com");

        assertNotNull(result);
        assertEquals("user@test.com", result.getUsername());
    }

    // -----------------------------------------------------------------
    // TESTE 2 — loadUserByUsername: usuário não encontrado
    // -----------------------------------------------------------------
    @Test
    void loadUserByUsername_ThrowsException_WhenNotFound() {
        when(userRepository.findByLogin("user@test.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> authorizationService.loadUserByUsername("user@test.com")
        );
    }

    // -----------------------------------------------------------------
    // TESTE 3 — registerUser: usuário já existe
    // -----------------------------------------------------------------
    @Test
    void registerUser_ThrowsException_WhenUserExists() {
        User existing = new User("user@test.com", "pass", UserRole.USER);

        when(userRepository.findByLogin("user@test.com"))
                .thenReturn(Optional.of(existing));

        Exception ex = assertThrows(Exception.class, () ->
                authorizationService.registerUser("user@test.com")
        );

        assertEquals("Usuário com esse CPF já existe", ex.getMessage());
    }

    // -----------------------------------------------------------------
    // TESTE 4 — registerUser: cria usuário e salva
    // -----------------------------------------------------------------
    @Test
    void registerUser_SavesNewUser_WhenNotExists() throws Exception {
        UserRepository repository = Mockito.mock(UserRepository.class);
        AuthorizationService service = new AuthorizationService();

        Field repoField = AuthorizationService.class.getDeclaredField("repository");
        repoField.setAccessible(true);
        repoField.set(service, repository);

        Mockito.when(repository.findByLogin("123")).thenReturn(Optional.empty());

        Mockito.when(repository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User user = service.registerUser("123");

        assertNotNull(user);
        assertEquals("123", user.getLogin());
        assertEquals(UserRole.USER, user.getRole());

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        assertTrue(encoder.matches("4321", user.getPassword()));
    }
}
