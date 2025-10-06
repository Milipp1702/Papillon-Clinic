package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalWorkdayDTO;

import java.util.List;

public class AppointmentMapper {

    public static Appointment fromDtoToEntity(AppointmentDTO dto, AppointmentTypes appointmentTypes, Patient patient, Professional professional, AppointmentFrequency frequency){
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

    public static AppointmentResponseDTO fromEntityToDtoResponse(Appointment appointment){
        return new AppointmentResponseDTO(appointment.getId(),
                appointment.getProfessional().getName(),
                appointment.getPatient().getName(),
                appointment.getAppointmentTypes().getName(),
                appointment.getAppointmentDate(),
                appointment.isPaid(),
                appointment.getProfessional().getSpecialty().getName()
                );
    }

    public static AppointmentDTO fromEntityToDto(Appointment appointment){
        AppointmentFrequencyDTO appointmentFrequencyDTO = AppointmentFrequencyMapper.fromEntityToDto(appointment.getFrequency());
        return new AppointmentDTO(appointment.getId(), appointment.getAppointmentDate(), appointment.getPayment_type(), appointment.getPayment_date(), appointment.getObservation(), appointment.getProfessional().getId(), appointment.getPatient().getId(),appointment.getAppointmentTypes().getId(), appointmentFrequencyDTO);
    }

    public static AppointmentDetailsDTO fromEntityToDtoDetailed(Appointment appointment, String specialtyId, String professionalName){
        AppointmentFrequencyDTO appointmentFrequencyDTO = null;

        if (appointment.getFrequency() != null) {
            appointmentFrequencyDTO = AppointmentFrequencyMapper.fromEntityToDto(appointment.getFrequency());
        }

        return new AppointmentDetailsDTO(
                appointment.getId(),
                appointment.getAppointmentDate(),
                appointment.getPayment_type(),
                appointment.getPayment_date(),
                appointment.getObservation(),
                appointment.getProfessional().getId(),
                appointment.getPatient().getId(),
                appointment.getAppointmentTypes().getId(),
                appointmentFrequencyDTO,
                specialtyId,
                professionalName
        );
    }
}
