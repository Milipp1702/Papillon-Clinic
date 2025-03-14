package br.edu.ifrs.canoas.papillon_clinic.domain.patient;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.Address;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table(name = "patients")
@Entity(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String name;

    @Column
    private LocalDate birthdate;

    @Column
    private Integer age;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "patients_guardians",
            joinColumns = @JoinColumn(name = "patients_id"),
            inverseJoinColumns = @JoinColumn(name = "guardians_id")
    )
    private List<Guardian> guardians;


    @Column
    private LocalDateTime created_at;

    @Column
    private LocalDateTime updated_at;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Appointment> listAppointments;
  
    @Column
    private String observation;
}
