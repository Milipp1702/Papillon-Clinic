package br.edu.ifrs.canoas.papillon_clinic.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.url}")
    private String appUrl;

    public void sendResetPasswordEmail(String destinatario, String token) throws MessagingException {
        String link = appUrl + "reset-password/?token=" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Redefinição de Senha – Clínica Papillon");
            helper.setFrom("papillon@resend.dev");


            String htmlContent = "<p>Olá,</p>" +
                    "<p>Recebemos uma solicitação para redefinir sua senha.</p>" +
                    "<p><a href=\"" + link + "\">Clique aqui para redefinir sua senha</a></p>" +
                    "<p>Este link é válido por 1 hora.</p>" +
                    "<p>Se você não solicitou essa alteração, ignore este e-mail.</p>" +
                    "<br><p>Atenciosamente,<br>Equipe Clínica Papillon</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
    }
}

