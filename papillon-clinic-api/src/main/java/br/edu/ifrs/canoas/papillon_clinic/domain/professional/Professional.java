package br.edu.ifrs.canoas.papillon_clinic.domain.professional;


import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "professionals")
@Entity(name = "professionals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Professional {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String name;

    @Column
    private String cpf;

    @Column
    private String crm;

    @ManyToOne
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;

    @Column
    private String phone_number;

    @Column
    private double discount;

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL)
    private List<Appointment> listAppointments;

    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL)
    private List<ProfessionalWorkday> workdays;
}
