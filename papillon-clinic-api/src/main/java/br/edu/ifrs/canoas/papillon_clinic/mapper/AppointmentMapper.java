package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.Address;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;

public class AppointmentMapper {

    public static Appointment fromDtoToEntity(AppointmentDTO dto, AppointmentTypes appointmentTypes, Patient patient, Professional professional){
        AppointmentFrequency frequency = AppointmentFrequencyMapper.fromDtoToEntity(dto.frequency());
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(dto.appointment_date());
        appointment.setAppointmentTypes(appointmentTypes);
        appointment.setPatient(patient);
        appointment.setProfessional(professional);
        appointment.setObservation(dto.observation());
        appointment.setPayment_date(dto.payment_date());
        appointment.setPayment_type(dto.payment_type());
        appointment.assignFrequency(frequency);
        return appointment;
    }

    public static AppointmentResponseDTO fromEntityToDto(Appointment appointment){
        return new AppointmentResponseDTO(appointment.getId(),
                appointment.getProfessional().getName(),
                appointment.getPatient().getName(),
                appointment.getAppointmentTypes().getName(),
                appointment.getAppointmentDate(),
                appointment.isPaid()
                );
    }
}
