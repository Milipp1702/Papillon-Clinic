package br.edu.ifrs.canoas.papillon_clinic.mapper;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentFrequency;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentFrequencyDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianDTO;

public class AppointmentFrequencyMapper {
    public static AppointmentFrequency fromDtoToEntity(AppointmentFrequencyDTO frequencyDTO){
        AppointmentFrequency frequency = new AppointmentFrequency();
        frequency.setEnd_date(frequencyDTO.end_date());
        frequency.setFrequency(frequencyDTO.frequency());
        frequency.setFrequency_interval(frequencyDTO.frequency_interval());
        frequency.setEmailReminder(frequencyDTO.emailReminder());
        return frequency;
    }
}
