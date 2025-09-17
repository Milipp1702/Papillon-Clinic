package br.edu.ifrs.canoas.papillon_clinic.domain.workday;
import br.edu.ifrs.canoas.papillon_clinic.domain.shift.ShiftDTO;
import java.util.List;

public record WorkdayWithShiftsDTO(String id, String name, List<ShiftDTO> shifts) {
}
