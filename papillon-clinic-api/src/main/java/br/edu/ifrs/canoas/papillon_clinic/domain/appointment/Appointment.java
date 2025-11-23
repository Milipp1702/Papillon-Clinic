package br.edu.ifrs.canoas.papillon_clinic.domain.appointment;


import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Table(name = "appointments")
@Entity(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @Column
    private String payment_type;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column
    private String observation;

    @ManyToOne
    @JoinColumn(name = "professional_id")
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "appointment_type")
    private AppointmentTypes appointmentTypes;

    @ManyToOne
    @JoinColumn(name = "appointment_frequency_id")
    private AppointmentFrequency frequency;

    public boolean isPaid(){
        return this.paymentDate!=null;
    }

    public void assignFrequency(AppointmentFrequency frequency) {
        if (this.frequency != null) {
            this.frequency.getAppointments().remove(this);
        }
        this.frequency = frequency;
        if (frequency != null) {
            if (frequency.getAppointments() == null) {
                frequency.setAppointments(new ArrayList<>());
            }
            frequency.getAppointments().add(this);
        }
    }
}
