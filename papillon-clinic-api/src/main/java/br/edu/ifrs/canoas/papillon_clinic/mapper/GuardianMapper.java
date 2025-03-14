package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianResponseDTO;

public class GuardianMapper {
    public static Guardian fromDtoToEntity(GuardianDTO guardianDto){
        Guardian guardian = new Guardian();
        guardian.setCpf(guardianDto.cpf());
        guardian.setName(guardianDto.name());
        guardian.setRelationship(guardianDto.relationship());
        guardian.setMain(guardianDto.isMain());
        guardian.setPhoneNumber(guardianDto.phoneNumber());
        return guardian;
    }

    public static Guardian fromDtoResponseToEntity(GuardianResponseDTO guardianDto){
        Guardian guardian = new Guardian();
        guardian.setId(guardianDto.id());
        guardian.setCpf(guardianDto.cpf());
        guardian.setName(guardianDto.name());
        guardian.setRelationship(guardianDto.relationship());
        guardian.setMain(guardianDto.isMain());
        guardian.setPhoneNumber(guardianDto.phoneNumber());
        return guardian;
    }
    public static GuardianResponseDTO fromEntityToDto(Guardian guardian){
        return new GuardianResponseDTO(guardian.getId(),guardian.getName(), guardian.getCpf(), guardian.getRelationship(), guardian.isMain(), guardian.getPhoneNumber());
    }

}
