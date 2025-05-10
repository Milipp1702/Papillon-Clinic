package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Entity(name = "professional_workdays")
@Table(name = "professional_workdays")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ProfessionalWorkday {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "professional_id")
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "workday_id")
    private WorkDay workday;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;
}

