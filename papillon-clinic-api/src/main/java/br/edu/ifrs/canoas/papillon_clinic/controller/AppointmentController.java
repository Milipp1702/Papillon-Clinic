package br.edu.ifrs.canoas.papillon_clinic.controller;


import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.service.AppointmentService;
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
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("appointment")
public class AppointmentController {
    @Autowired
    private AppointmentService service;

    @GetMapping("getAmount")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Long> getAmountAppointments(){
        return ResponseEntity.ok(service.getQuantityAppointments());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<AppointmentDetailsDTO> findById(@PathVariable("id") String id) throws Exception {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public List<LocalDateTime> register(@RequestBody AppointmentDTO appointmentDTO) throws Exception {
        return service.registerAppointment(appointmentDTO);
    }
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public List<LocalDateTime> update(@RequestBody AppointmentDTO appointmentDTO) throws Exception {
        return service.updateAppointment(appointmentDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable("id") String id, @RequestParam(name = "deleteFrequencyAppointments") boolean deleteFrequencyAppointments) throws Exception {
        service.deleteAppointment(id, deleteFrequencyAppointments);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<AppointmentResponseDTO>> getListAppointments(@PageableDefault() Pageable pagination){
        return ResponseEntity.ok(service.getListAppointments(pagination));
    }

    @GetMapping("getListAppointments/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Page<AppointmentResponseDTO>> getListAppointmentsForProfessional(@PathVariable String userId, @PageableDefault() Pageable pagination){
        return ResponseEntity.ok(service.getListAppointmentsForProfessional(pagination, userId));
    }

    @GetMapping("getListAppointmentsFinancial")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<AppointmentFinancialDTO>> getAppointmentsFinancial(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String professionalId) {
        return ResponseEntity.ok(service.getAppointmentFinancials(patientId, professionalId));
    }

    @GetMapping("/search")
    public Page<AppointmentResponseDTO> search(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.search(query, pageable);
    }

    @GetMapping("getAppointmentsForCalendar")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointmentsForCalendar(@RequestParam(required = false) List<String> professionalIds){
        return ResponseEntity.ok(service.getAppointmentsForCalendar(professionalIds));
    }
}
