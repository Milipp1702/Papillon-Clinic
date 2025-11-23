package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,String> {

    List<Patient> findByActiveTrue();

    Page<Patient> findByActiveTrue(Pageable pageable);

    long countByActiveTrue();

    Page<Patient> findByNameContainingIgnoreCaseOrAgeOrGuardiansNameContainingIgnoreCaseAndGuardiansMainTrue(
            String name,
            Integer age,
            String guardianName,
            Pageable pageable
    );

    Optional<Patient> findByNameAndBirthdate(String name, LocalDate birthdate);
}
