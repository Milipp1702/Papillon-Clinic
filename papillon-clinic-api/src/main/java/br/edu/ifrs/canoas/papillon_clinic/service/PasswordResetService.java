package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.PasswordResetDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.PasswordResetToken;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.repository.PasswordResetTokenRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void generateRecoveryToken(String login) throws Exception {
        System.out.println(login);
        Optional<User> user = userRepository.findUserByLogin(login.trim());
        System.out.println(user.isPresent());
        if(user.isEmpty()) {
            throw new Exception("Usuário não encontrado!");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user.get());
        resetToken.setExpirationDate(LocalDateTime.now().plusHours(1));

        tokenRepository.save(resetToken);

        emailService.sendResetPasswordEmail(user.get().getLogin(), token);
    }

    public void resetPassword(PasswordResetDTO dto) throws Exception {
        PasswordResetToken resetToken = tokenRepository.findByToken(dto.token())
                .orElseThrow(() -> new Exception("Token inválido ou expirado!"));

        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new Exception("Token expirado! Solicite novamente a troca de senha!");
        }

        User user = resetToken.getUser();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(dto.newPassword());
        user.updatePassword(encoder.encode(dto.newPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
