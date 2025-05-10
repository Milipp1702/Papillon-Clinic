package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.WorkDay;
import br.edu.ifrs.canoas.papillon_clinic.repository.WorkdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WorkdayService {

    @Autowired
    private WorkdayRepository workdayRepository;

    public Optional<WorkDay> getById(String workdayId) {
        return workdayRepository.findById(workdayId);
    }

    public WorkDay getWorkdayById(String workdayId) {
        return workdayRepository.findById(workdayId)
                .orElseThrow(() -> new RuntimeException("Workday not found"));
    }
}
