package br.edu.ifrs.canoas.papillon_clinic.mapper;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypeDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypes;

public class AppointmentTypeMapper {

    public static AppointmentTypeDTO fromEntityToDto(AppointmentTypes type){
        return new AppointmentTypeDTO(type.getId(),type.getName(), type.getAmount());
    }
}
