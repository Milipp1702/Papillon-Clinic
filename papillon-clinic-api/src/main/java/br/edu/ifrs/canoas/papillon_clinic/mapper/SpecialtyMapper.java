package br.edu.ifrs.canoas.papillon_clinic.mapper;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Specialty;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.SpecialtyDTO;

public class SpecialtyMapper {
    public static SpecialtyDTO fromEntityToDto(Specialty specialty){
        return new SpecialtyDTO(specialty.getId(), specialty.getName());
    }
}
