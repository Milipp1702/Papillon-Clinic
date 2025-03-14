package br.edu.ifrs.canoas.papillon_clinic.service;


import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientDetailedDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientRegisterDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AddressMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.GuardianMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.PatientMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class    PatientService {
    @Autowired
    PatientRepository repository;

    public Optional<Patient> getById(String id){
        return repository.findById(id);
    }

    public PatientDetailedDTO findById(String id) throws Exception {
        Optional<Patient> patient = this.getById(id);
        if(patient.isEmpty()){
            throw new Exception();
        }
        return PatientMapper.fromEntityToDtoDetailed(patient.get());
    }

    public void updatePatient(PatientDetailedDTO patient) throws Exception {
        Optional<Patient> oldPatient = repository.findById(patient.id());
        if(oldPatient.isEmpty()){
            throw new Exception();
        }
        Patient newPatient = oldPatient.get();
        newPatient.setName(patient.name());
        newPatient.setBirthdate(patient.birthdate());
        newPatient.setAge(Period.between(patient.birthdate(), LocalDate.now()).getYears());
        newPatient.setAddress(AddressMapper.fromDtoToEntity(patient.address()));
        newPatient.setGuardians(patient.listGuardian().stream().map(GuardianMapper::fromDtoResponseToEntity).collect(Collectors.toList()));
        newPatient.setObservation(patient.observation());
        repository.save(newPatient);
    }

    public void registerPatient(PatientRegisterDTO patientDto){
        Patient newPatient = PatientMapper.fromDtoToEntity(patientDto);
        repository.save(newPatient);
    }

    public Page<PatientResponseDTO> getListPatients(Pageable pagination){
        return repository.findAll(pagination).map(PatientMapper::fromEntityToDto);
    }

    public long getQuantityPatients(){
        return repository.count();
    }
}
