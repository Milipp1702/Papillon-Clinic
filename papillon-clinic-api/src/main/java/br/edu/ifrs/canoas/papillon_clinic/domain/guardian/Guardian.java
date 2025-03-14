package br.edu.ifrs.canoas.papillon_clinic.domain.guardian;

import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Table(name = "guardians")
@Entity(name = "guardians")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Guardian {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String name;

    @Column
    private String cpf;

    @Column
    private String relationship;

    @ManyToMany(mappedBy = "guardians")
    private List<Patient> patients = new ArrayList<>();

    @Column(name = "is_main")
    private boolean isMain;

    @Column(name = "phone_number")
    private String phoneNumber;
}
