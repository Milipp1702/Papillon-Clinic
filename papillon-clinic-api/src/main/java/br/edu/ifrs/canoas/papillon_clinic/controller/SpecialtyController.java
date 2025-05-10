package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.SpecialtyDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.SpecialtyService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("specialty")
public class SpecialtyController {
    @Autowired
    private SpecialtyService service;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<SpecialtyDTO>> getListSpecialties() {
        return ResponseEntity.ok(service.getListSpecialties());
    }
}