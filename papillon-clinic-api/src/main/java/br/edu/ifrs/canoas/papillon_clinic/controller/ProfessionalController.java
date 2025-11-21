package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableSlot;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.ProfessionalService;
import br.edu.ifrs.canoas.papillon_clinic.service.ProfessionalWorkdayService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("professional")
public class ProfessionalController {
    @Autowired
    private ProfessionalService service;

    @Autowired
    private ProfessionalWorkdayService professionalWorkdayService;

    @PostMapping
    @Transactional
    public ResponseEntity<String> register(@RequestBody ProfessionalDTO professionalDto) throws Exception {
        try {
            service.registerProfessional(professionalDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Profissional cadastrado com sucesso!");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void update(@RequestBody ProfessionalDTO professionalDto) throws Exception {
        service.updateProfessional(professionalDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteProfessional(@PathVariable("id") String id) throws Exception {
        service.softDeleteProfessional(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ProfessionalDTO> getById(@PathVariable("id") String id) throws Exception {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<ProfessionalResponseDTO>> getListProfessional(@PageableDefault(sort = "name") Pageable pagination) {
        return ResponseEntity.ok(service.getListProfessionals(pagination));
    }
    @GetMapping("getAmount")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Long> getQuantityProfessionals(){
        return ResponseEntity.ok(service.getQuantityProfessionals());
    }

    @GetMapping("getRanking")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<ProfessionalResponseDTO>> getTop6Professionals(){
        return ResponseEntity.ok(service.getTop6Professional());
    }

    @GetMapping("getBySpecialty")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<ProfessionalResponseDTO>> getProfessionalsBySpecialty(String specialty_id){
        return ResponseEntity.ok(service.getProfessionalsBySpecialty(specialty_id));
    }

    @GetMapping("getAllProfessionals")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<ProfessionalResponseDTO>> getAllProfessionals(){
        return ResponseEntity.ok(service.getAllProfessionals());
    }

    @GetMapping("all-available-slots")
    public ResponseEntity<List<AvailableSlot>> getAllAvailableSlots(
            @RequestParam(required = false) List<String> ids,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String specialty) {

        LocalDate parsedDate = null;
        if (date != null && !date.isEmpty()) {
            parsedDate = LocalDate.parse(date);
        }

        List<AvailableSlot> slots = professionalWorkdayService.getAllAvailableSlots(parsedDate, specialty, ids);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/search")
    public Page<ProfessionalResponseDTO> search(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.search(query, pageable);
    }

    @GetMapping("getIdByUser")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> getIdByUser(String userId){
        return ResponseEntity.ok(service.getIdByUser(userId));
    }
}
