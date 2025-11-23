package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.service.EmailService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.Emails;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.junit.jupiter.api.Test;
import org.mockito.MockedConstruction;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmailServiceTests {

    @Test
    void sendResetPasswordEmail_CallsResendSend() throws Exception {
        CreateEmailResponse responseMock = mock(CreateEmailResponse.class);

        Emails emailsMock = mock(Emails.class);
        when(emailsMock.send(any(CreateEmailOptions.class))).thenReturn(responseMock);

        try (MockedConstruction<Resend> mocked = mockConstruction(Resend.class,
                (mock, context) -> {
                    when(mock.emails()).thenReturn(emailsMock);
                })) {

            EmailService emailService = new EmailService();
            emailService.sendResetPasswordEmail("test@example.com", "token123");

            verify(emailsMock).send(any(CreateEmailOptions.class));
        }
    }

    @Test
    void sendResetPasswordEmail_CatchesResendException() throws Exception {
        Emails emailsMock = mock(Emails.class);
    when(emailsMock.send(any(CreateEmailOptions.class))).thenThrow(new ResendException("teste"));
        try (MockedConstruction<Resend> mocked = mockConstruction(Resend.class,
                (mock, context) -> when(mock.emails()).thenReturn(emailsMock))) {

            EmailService emailService = new EmailService();

            emailService.sendResetPasswordEmail("test@example.com", "token123");

            verify(emailsMock).send(any(CreateEmailOptions.class));
        }
    }
}

