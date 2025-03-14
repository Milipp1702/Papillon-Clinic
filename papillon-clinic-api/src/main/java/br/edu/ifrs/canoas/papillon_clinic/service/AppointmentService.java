package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypes;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepository repository;

    @Autowired
    PatientService patientService;

    @Autowired
    ProfessionalService professionalService;

    @Autowired
    AppointmentTypesService appointmentTypesService;

    public void registerAppointment(AppointmentDTO appointmentDto) throws Exception {
        Optional<Patient> patient = patientService.getById(appointmentDto.patientId());
        if(patient.isEmpty()){
            throw new Exception("Not Found");
        }
        Optional<Professional> professional = professionalService.getById(appointmentDto.professionalId());
        if(professional.isEmpty()){
            throw new Exception("Not Found");
        }
        Optional<AppointmentTypes> appointmentTypes = appointmentTypesService.getById(appointmentDto.appointmentTypeId());
        if(appointmentTypes.isEmpty()){
            throw new Exception("Not Found");
        }
        Appointment newAppointment = AppointmentMapper.fromDtoToEntity(appointmentDto,appointmentTypes.get(),patient.get(),professional.get());
        repository.save(newAppointment);
    }

    public Page<AppointmentResponseDTO> getListAppointments(Pageable pagination){
        return repository.findAll(pagination).map(AppointmentMapper::fromEntityToDto);
    }

    public long getQuantityAppointments(){
        return repository.findByAppointmentDateBetween(LocalDate.now().with(TemporalAdjusters.firstDayOfMonth()),LocalDate.now()).size();
    }
}
