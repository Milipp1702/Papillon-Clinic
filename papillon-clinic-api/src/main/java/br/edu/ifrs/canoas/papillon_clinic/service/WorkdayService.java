package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkDay;
import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.domain.shift.ShiftDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkdayWithShiftsDTO;
import br.edu.ifrs.canoas.papillon_clinic.repository.WorkdayRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkdayService {

    @Autowired
    private WorkdayRepository workdayRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    public Optional<WorkDay> getById(String workdayId) {
        return workdayRepository.findById(workdayId);
    }

    public WorkDay getWorkdayById(String workdayId) {
        return workdayRepository.findById(workdayId)
                .orElseThrow(() -> new RuntimeException("Workday not found"));
    }

    public List<WorkdayWithShiftsDTO> getAllWorkdaysWithShifts() {
        List<WorkDay> workdays = workdayRepository.findAll();
        List<Shift> shifts = shiftRepository.findAll();

        List<ShiftDTO> shiftDTOs = shifts.stream()
                .map(shift -> new ShiftDTO(shift.getId(), shift.getShift(), shift.getStart_time(),shift.getEnd_time()))
                .toList();

        return workdays.stream()
                .map(workday -> new WorkdayWithShiftsDTO(
                        workday.getId(),
                        workday.getDay(),
                        shiftDTOs
                ))
                .toList();
    }

}
