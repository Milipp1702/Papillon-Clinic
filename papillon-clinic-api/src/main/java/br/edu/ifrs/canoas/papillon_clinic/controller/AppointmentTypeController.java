package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypeDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.AppointmentTypesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("appointmentType")
public class AppointmentTypeController {
    @Autowired
    private AppointmentTypesService service;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<AppointmentTypeDTO>> getListTypes() {
        return ResponseEntity.ok(service.getListTypes());
    }
}
