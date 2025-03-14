package br.edu.ifrs.canoas.papillon_clinic.controller;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.ProfessionalService;
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
@RequestMapping("professional")
public class ProfessionalController {
    @Autowired
    private ProfessionalService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void register(@RequestBody ProfessionalDTO professionalDto){
        service.registerProfessional(professionalDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public void update(@RequestBody ProfessionalDTO professionalDto) throws Exception {
        service.updateProfessional(professionalDto);
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
}
