package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalResponseDTO;

public class ProfessionalMapper {
    public static Professional fromDtoToEntity(ProfessionalDTO dto){
        Professional professional = new Professional();
        professional.setCpf(dto.cpf());
        professional.setDiscount(dto.discount());
        professional.setCrm(dto.crm());
        professional.setName(dto.name());
        professional.setSpeciality(dto.speciality());
        professional.setPhone_number(dto.phone_number());
        return professional;
    }

    public static ProfessionalResponseDTO fromEntityToDtoResponse(Professional professional){
        return new ProfessionalResponseDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getCrm());
    }

    public static ProfessionalDTO fromEntityToDto(Professional professional){
        return new ProfessionalDTO(professional.getId(), professional.getName(), professional.getCpf(), professional.getCrm(), professional.getSpeciality(), professional.getPhone_number(), professional.getDiscount());
    }
}
