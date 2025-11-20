package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient,String> {

    List<Patient> findByActiveTrue();

    Page<Patient> findByActiveTrue(Pageable pageable);

    long countByActiveTrue();

    Page<Patient> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Patient> findByGuardiansNameContainingIgnoreCaseAndGuardiansMainTrue(
            String guardianName,
            Pageable pageable
    );

    Page<Patient> findByBirthdateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    boolean existsByNameAndBirthdate(String name, LocalDate birthdate);
}
