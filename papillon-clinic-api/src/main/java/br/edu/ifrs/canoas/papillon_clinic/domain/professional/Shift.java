package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Table(name = "shifts")
@Entity(name = "shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String shift;

    @Column
    private LocalTime start_time;

    @Column
    private LocalTime end_time;
}
