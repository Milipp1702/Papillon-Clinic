package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.PasswordResetDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.recovery.RequestPasswordResetDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.text.Normalizer;


    @RestController
    @RequestMapping("/password-reset")
    public class PasswordResetController {

        @Autowired
        private PasswordResetService passwordResetService;

        @PostMapping("/requestPasswordReset")
        public ResponseEntity<String> requestPasswordReset(@RequestBody RequestPasswordResetDTO dto) {
            try {
                String loginNormalized = Normalizer.normalize(dto.email(), Normalizer.Form.NFKC)
                        .replaceAll("\\p{C}", "")
                        .trim()
                        .toLowerCase();

                passwordResetService.generateRecoveryToken(loginNormalized);
                return ResponseEntity.ok("Password reset email sent successfully.");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        @PostMapping("/resetPassword")
        public ResponseEntity<String> resetPassword(@RequestBody PasswordResetDTO dto) {
            try {
                passwordResetService.resetPassword(dto);
                return ResponseEntity.ok("Password updated successfully.");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    }

    
