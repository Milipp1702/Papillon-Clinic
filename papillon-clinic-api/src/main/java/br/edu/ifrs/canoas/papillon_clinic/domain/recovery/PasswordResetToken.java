package br.edu.ifrs.canoas.papillon_clinic.domain.recovery;

import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "password_reset")
@Entity(name = "password_reset")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
}

