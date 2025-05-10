package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Specialty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "appointment_types")
@Entity(name = "appointment_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class AppointmentTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String name;

    @Column
    private double amount;

    @ManyToMany
    @JoinTable(
            name = "specialty_appointment_type",
            joinColumns = @JoinColumn(name = "appointment_type_id"),
            inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private List<Specialty> specialties;
}
