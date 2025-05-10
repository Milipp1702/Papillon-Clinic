package br.edu.ifrs.canoas.papillon_clinic.mapper;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;

public class ProfessionalWorkdayMapper {

    public static ProfessionalWorkday fromDtoToEntity(WorkDay workday, Shift shift) {
        System.out.println(workday);
        ProfessionalWorkday professionalWorkday = new ProfessionalWorkday();
        professionalWorkday.setWorkday(workday);
        professionalWorkday.setShift(shift);

        return professionalWorkday;
    }

    public static ProfessionalWorkdayDTO fromEntityToDto(ProfessionalWorkday entity) {
        WorkDayDTO workdayDTO = new WorkDayDTO(entity.getWorkday().getId(), entity.getWorkday().getDay());
        ShiftDTO shiftDTO = new ShiftDTO(entity.getShift().getId(), entity.getShift().getShift(), entity.getShift().getStart_time(), entity.getShift().getEnd_time());

        return new ProfessionalWorkdayDTO(entity.getId(), workdayDTO.id(), shiftDTO.id());
    }
}
