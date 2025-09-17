package br.edu.ifrs.canoas.papillon_clinic.domain.workday;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "workdays")
@Entity(name = "workdays")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class WorkDay {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String day;
}
