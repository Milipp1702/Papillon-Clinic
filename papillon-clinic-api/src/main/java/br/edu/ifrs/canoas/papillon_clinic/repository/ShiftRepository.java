package br.edu.ifrs.canoas.papillon_clinic.repository;

import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftRepository extends JpaRepository<Shift,String> {
}
