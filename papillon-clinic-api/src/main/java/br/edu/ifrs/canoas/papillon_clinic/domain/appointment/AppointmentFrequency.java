package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
    private LocalDate end_date;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column
    private Integer frequency_interval;

    @OneToMany(mappedBy = "frequency", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();
}