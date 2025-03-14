package br.edu.ifrs.canoas.papillon_clinic.domain.address;

import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "addresses")
@Entity(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String street;

    @Column
    private Integer number;

    @Column
    private String city;

    @Column
    private String neighborhood;

    @Column
    private String complement;

    @OneToOne(mappedBy = "address")
    private Patient patient;
}
