package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    public Optional<Shift> getById(String shiftId) {
        return shiftRepository.findById(shiftId);
    }

    public Shift getShiftById(String shiftId) {
        return shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }
}
