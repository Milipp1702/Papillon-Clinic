package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional,String> {
    @Query("select p, (select count(a) from appointments a WHERE a.professional.id = p.id GROUP BY p.id ) as qtd  from professionals p ORDER BY qtd DESC LIMIT 6")
    List<Professional> getTop6Professional();

    List<Professional> findBySpecialtyIdAndActiveTrue(String specialtyId);

    @Query("SELECT p.name FROM professionals p WHERE p.id = :id AND p.active = true")
    String findNameById(@Param("id") String id);

    @Query("SELECT p.specialty.id FROM professionals p WHERE p.id = :id AND p.active = true")
    String findSpecialtyById(@Param("id") String id);

    @Query("SELECT p.id FROM professionals p WHERE p.specialty.id = :specialtyId AND p.active = true")
    List<String> findIdsBySpecialtyId(@Param("specialtyId") String specialtyId);

    boolean existsByEmail(String email);

    @Query("SELECT p.id FROM professionals p WHERE p.active = true")
    List<String> findAllIds();

    Optional<Professional> findByUserIdAndActiveTrue(String userId);

    Page<Professional> findByNameContainingIgnoreCaseOrCpfContainingIgnoreCaseOrSpecialtyNameContainingIgnoreCase(
            String name, String cpf, String specialtyDescription, Pageable pageable
    );
}
