package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;

import java.util.List;

public class ProfessionalMapper {
    public static Professional fromDtoToEntity(ProfessionalDTO dto, Specialty specialty, List<ProfessionalWorkday> workdays){
        Professional professional = new Professional();
        professional.setCpf(dto.cpf());
        professional.setEmail(dto.email());
        professional.setDiscount(dto.discount());
        professional.setRegisterNumber(dto.registerNumber());
        professional.setName(dto.name());
        professional.setSpecialty(specialty);
        professional.setPhone_number(dto.phone_number());
        professional.setWorkdays(workdays);
        return professional;
    }

    public static ProfessionalResponseDTO fromEntityToDtoResponse(Professional professional){
        return new ProfessionalResponseDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getSpecialty().getName());
    }

    public static ProfessionalDTO fromEntityToDto(Professional professional){
        List<ProfessionalWorkdayDTO> workdays = professional.getWorkdays().stream().map(ProfessionalWorkdayMapper::fromEntityToDto).toList();
        return new ProfessionalDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getEmail(), professional.getRegisterNumber(), professional.getSpecialty().getId(), professional.getPhone_number(), professional.getDiscount(),workdays);
    }
}
