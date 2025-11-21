package br.edu.ifrs.canoas.papillon_clinic.service;


import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientDetailedDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientRegisterDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AddressMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.GuardianMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.PatientMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;

@Service
public class    PatientService {
    @Autowired
    PatientRepository repository;

    @Autowired
    AppointmentRepository appointmentRepository;

    public Optional<Patient> getById(String id) {
        return repository.findById(id)
                .filter(Patient::isActive);
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
        newPatient.setCpf(patient.cpf());
        newPatient.setBirthdate(patient.birthdate());
        newPatient.setAge(Period.between(patient.birthdate(), LocalDate.now()).getYears());
        newPatient.setAddress(AddressMapper.fromDtoToEntity(patient.address()));
        newPatient.setGuardians(patient.listGuardian().stream().map(GuardianMapper::fromDtoResponseToEntity).collect(Collectors.toList()));
        newPatient.setObservation(patient.observation());
        repository.save(newPatient);
    }

    public void registerPatient(PatientRegisterDTO patientDto) throws Exception {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthdate = LocalDate.parse(patientDto.birthdate(), formatter);
        Optional<Patient> oldPatient = repository.findByNameAndBirthdate(patientDto.name(), birthdate);
        if(oldPatient.isPresent()) {
            if(oldPatient.get().isActive()){
                throw new Exception("Paciente já existe!");
            }else {
                Patient reactivePatient = oldPatient.get();
                reactivePatient.setActive(true);

                repository.save(reactivePatient);
                throw new Exception("Paciente reativado!");
            }
        }
        Patient newPatient = PatientMapper.fromDtoToEntity(patientDto);
        repository.save(newPatient);
    }

    public Page<PatientResponseDTO> search(String query, Pageable pageable) {
        Page<Patient> result;

        try {
            int age = Integer.parseInt(query);
            LocalDate today = LocalDate.now();
            LocalDate startDate = today.minusYears(age + 1).plusDays(1);
            LocalDate endDate = today.minusYears(age);

            result = repository.findByBirthdateBetween(startDate, endDate, pageable);

        } catch (NumberFormatException e) {
            result = repository.findByNameContainingIgnoreCase(query, pageable);

            if (result.isEmpty()) {
                result = repository.findByGuardiansNameContainingIgnoreCaseAndGuardiansMainTrue(query, pageable);
            }
        }

        return result.map(p -> {
            String mainGuardian = p.getGuardians().stream()
                    .filter(Guardian::isMain)
                    .map(Guardian::getName)
                    .findFirst()
                    .orElse(null);

            return new PatientResponseDTO(
                    p.getId(),
                    p.getName(),
                    Period.between(p.getBirthdate(), LocalDate.now()).getYears(),
                    mainGuardian
            );
        });
    }


    public Page<PatientResponseDTO> getListPatients(Pageable pagination) {
        return repository.findByActiveTrue(pagination)
                .map(PatientMapper::fromEntityToDto);
    }

    public List<PatientResponseDTO> getAllPatients() {
        return repository.findByActiveTrue().stream()
                .map(PatientMapper::fromEntityToDto)
                .collect(Collectors.toList());
    }

    public void softDeletePatient(String id) throws Exception {
        Optional<Patient> optionalPatient = repository.findById(id);
        if (optionalPatient.isEmpty() || !optionalPatient.get().isActive()) {
            throw new Exception("Paciente não encontrado ou já está inativo!");
        }

        Patient patient = optionalPatient.get();
        List<Appointment> futureAppointments = appointmentRepository
                .findByPatient_IdAndAppointmentDateAfterAndPaymentDateIsNull(patient.getId(), LocalDateTime.now());

        appointmentRepository.deleteAll(futureAppointments);

        patient.setActive(false);
        repository.save(patient);
    }

    public long getQuantityPatients(){
        return repository.count();
    }
}
