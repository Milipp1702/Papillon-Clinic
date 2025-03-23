package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "appointment_frequency")
@Entity(name = "appointment_frequency")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class AppointmentFrequency {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private LocalDateTime end_date;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column()
    private Integer frequency_interval;

    @Column(name = "email_reminder")
    private boolean emailReminder;

    @OneToOne(mappedBy = "frequency")
    private Appointment appointment;
}