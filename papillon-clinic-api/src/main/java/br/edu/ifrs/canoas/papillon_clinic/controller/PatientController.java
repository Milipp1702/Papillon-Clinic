package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientDetailedDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientRegisterDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.PatientResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.PatientService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("patient")
public class PatientController {
    @Autowired
    private PatientService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void register(@RequestBody PatientRegisterDTO patientDto) throws Exception {
        service.registerPatient(patientDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void update(@RequestBody PatientDetailedDTO patientDto) throws Exception {
        service.updatePatient(patientDto);
    }

    @GetMapping("/search")
    public Page<PatientResponseDTO> search(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.search(query, pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deletePatient(@PathVariable("id") String id) throws Exception {
        service.softDeletePatient(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PatientDetailedDTO> getById(@PathVariable("id") String id) throws Exception {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<PatientResponseDTO>> getListPatients(@PageableDefault(sort = "name")Pageable pagination) {
        return ResponseEntity.ok(service.getListPatients(pagination));
    }

    @GetMapping("getAllPatients")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<PatientResponseDTO>> getAllPatients() {
        return ResponseEntity.ok(service.getAllPatients());
    }

    @GetMapping("getAmount")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Long> getQuantityPatients(){
        return ResponseEntity.ok(service.getQuantityPatients());
    }
}
