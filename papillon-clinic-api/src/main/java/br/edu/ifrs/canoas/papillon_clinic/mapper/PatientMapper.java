package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.Address;
import br.edu.ifrs.canoas.papillon_clinic.domain.address.AddressDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientDetailedDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientRegisterDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientResponseDTO;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class PatientMapper {
    public static Patient fromDtoToEntity(PatientRegisterDTO patientDto){
        Address address = AddressMapper.fromDtoToEntity(patientDto.address());

        Patient patient = new Patient();
        patient.setName(patientDto.name());
        patient.setBirthdate(patientDto.birthdate());
        patient.setAge(Period.between(patientDto.birthdate(), LocalDate.now()).getYears());
        patient.setAddress(address);
        patient.setGuardians(patientDto.listGuardian().stream().map(GuardianMapper::fromDtoToEntity).collect(Collectors.toList()));
        patient.setObservation(patientDto.observation());
        return patient;
    }

    public static Patient fromDtoDetailedToEntity(PatientDetailedDTO patientDto){
        Address address = AddressMapper.fromDtoToEntity(patientDto.address());

        Patient patient = new Patient();
        patient.setName(patientDto.name());
        patient.setBirthdate(patientDto.birthdate());
        patient.setAge(Period.between(patientDto.birthdate(), LocalDate.now()).getYears());
        patient.setAddress(address);
        patient.setGuardians(patientDto.listGuardian().stream().map(GuardianMapper::fromDtoResponseToEntity).collect(Collectors.toList()));
        patient.setObservation(patientDto.observation());
        return patient;
    }
    public static PatientResponseDTO fromEntityToDto(Patient patient){
        Optional<Guardian> mainGuardian = patient.getGuardians().stream().filter(Guardian::isMain).findFirst();
        if(mainGuardian.isEmpty()){
            mainGuardian = patient.getGuardians().stream().findFirst();
        }
        return new PatientResponseDTO(patient.getId(), patient.getName(),
                patient.getAge(), mainGuardian.get().getName());
    }

    public static PatientDetailedDTO fromEntityToDtoDetailed(Patient patient){
        AddressDTO address = AddressMapper.fromEntityToDto(patient.getAddress());

        List<GuardianResponseDTO> listGuardians = patient.getGuardians().stream().map(GuardianMapper::fromEntityToDto).toList();
        return new PatientDetailedDTO(patient.getId(), patient.getName(),
                patient.getBirthdate(), address, listGuardians, patient.getObservation());
    }
}
