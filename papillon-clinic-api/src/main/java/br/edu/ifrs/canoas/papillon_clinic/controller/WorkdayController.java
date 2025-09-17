package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkdayWithShiftsDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.WorkdayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("workday")
public class WorkdayController {
    @Autowired
    private WorkdayService service;

    @GetMapping("/getWorkdaysWithShifts")
    public ResponseEntity<List<WorkdayWithShiftsDTO>> getAllWorkdaysWithShifts() {
        return ResponseEntity.ok(service.getAllWorkdaysWithShifts());
    }
}
