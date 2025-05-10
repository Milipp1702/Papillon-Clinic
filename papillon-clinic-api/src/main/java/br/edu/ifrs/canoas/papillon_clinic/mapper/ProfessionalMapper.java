package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;

import java.util.List;

public class ProfessionalMapper {
    public static Professional fromDtoToEntity(ProfessionalDTO dto, Specialty specialty, List<ProfessionalWorkday> workdays){
        Professional professional = new Professional();
        professional.setCpf(dto.cpf());
        professional.setDiscount(dto.discount());
        professional.setCrm(dto.crm());
        professional.setName(dto.name());
        professional.setSpecialty(specialty);
        professional.setPhone_number(dto.phone_number());
        professional.setWorkdays(workdays);
        return professional;
    }

    public static ProfessionalResponseDTO fromEntityToDtoResponse(Professional professional){
        return new ProfessionalResponseDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getCrm());
    }

    public static ProfessionalDTO fromEntityToDto(Professional professional){
        List<ProfessionalWorkdayDTO> workdays = professional.getWorkdays().stream().map(ProfessionalWorkdayMapper::fromEntityToDto).toList();
        return new ProfessionalDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getCrm(), professional.getSpecialty().getName(), professional.getPhone_number(), professional.getDiscount(),workdays);
    }
}
