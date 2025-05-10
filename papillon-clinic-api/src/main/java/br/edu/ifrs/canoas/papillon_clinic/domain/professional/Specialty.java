package br.edu.ifrs.canoas.papillon_clinic.domain.professional;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "specialties")
@Entity(name = "specialties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String name;

    @OneToMany(mappedBy = "specialty")
    private List<Professional> professionals;
}
