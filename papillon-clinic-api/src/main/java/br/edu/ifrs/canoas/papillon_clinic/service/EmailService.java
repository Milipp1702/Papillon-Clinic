package br.edu.ifrs.canoas.papillon_clinic.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
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

    @Value("${spring.mail.username}")
    private String apiKey;

    public void sendResetPasswordEmail(String addressee, String token) throws MessagingException {
        Resend resend = new Resend(apiKey);

        String link = appUrl + "reset-password/?token=" + token;
        String htmlContent = "<p>Olá,</p>" +
                "<p>Recebemos uma solicitação para redefinir sua senha.</p>" +
                "<p><a href=\"" + link + "\">Clique aqui para redefinir sua senha</a></p>" +
                "<p>Este link é válido por 1 hora.</p>" +
                "<p>Se você não solicitou essa alteração, ignore este e-mail.</p>" +
                "<br><p>Atenciosamente,<br>Equipe Clínica Papillon</p>";

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Papillon Clinic <papillon_clinic@resend.dev>")
                .to(addressee)
                .subject("Redefinição de Senha – Clínica Papillon")
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
        } catch (ResendException e) {
            e.printStackTrace();
        }
    }
}

