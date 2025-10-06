package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkDay;
import br.edu.ifrs.canoas.papillon_clinic.mapper.ProfessionalMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.ProfessionalWorkdayMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalWorkdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfessionalService {
    @Autowired
    ProfessionalRepository repository;

    @Autowired
    SpecialtyService specialtyService;

    @Autowired
    WorkdayService workdayService;

    @Autowired
    ShiftService shiftService;

    @Autowired
    AuthorizationService userService;

    @Autowired
    ProfessionalWorkdayRepository professionalWorkdayRepository;

    public Optional<Professional> getById(String id){
        return repository.findById(id);
    }

    public ProfessionalDTO findById(String id) throws Exception {
        Optional<Professional> professional = this.getById(id);
        if(professional.isEmpty()){
            throw new Exception();
        }
        return ProfessionalMapper.fromEntityToDto(professional.get());
    }

    public void updateProfessional(ProfessionalDTO professional) throws Exception {
        Optional<Professional> oldProfessional = repository.findById(professional.id());
        if(oldProfessional.isEmpty()){
            throw new Exception();
        }
        Optional<Specialty> specialty = specialtyService.getById(professional.specialty_id());
        if(specialty.isEmpty()){
            throw new Exception("Not Found");
        }
        Professional newProfessional = oldProfessional.get();
        newProfessional.setPhone_number(professional.phone_number());
        newProfessional.setName(professional.name());
        newProfessional.setCpf(professional.cpf());
        newProfessional.setEmail(professional.email());
        newProfessional.setDiscount(professional.discount());
        newProfessional.setCrm(professional.crm());
        newProfessional.setSpecialty(specialty.get());

        professionalWorkdayRepository.deleteAllByProfessionalId(professional.id());

        List<ProfessionalWorkday> workdays = professional.workdays().stream()
                .map(dto ->
                { WorkDay workday = workdayService.getWorkdayById(dto.workday_id());
                    System.out.println(workday.getDay());
                    return ProfessionalWorkdayMapper.fromDtoToEntity(workday, shiftService.getShiftById(dto.shift_id()));})
                .toList();
        workdays.forEach(workday -> workday.setProfessional(newProfessional));
        newProfessional.getWorkdays().clear();
        newProfessional.getWorkdays().addAll(workdays);

        repository.save(newProfessional);
    }

    public void registerProfessional(ProfessionalDTO dto) throws Exception {
        Specialty specialty = specialtyService.getById(dto.specialty_id())
                .orElseThrow(() -> new Exception("Especialidade não encontrada"));

        User user = userService.registerUser(dto.email());

        List<ProfessionalWorkday> workdays = dto.workdays().stream()
                .map(wd -> {
                    WorkDay workday = workdayService.getWorkdayById(wd.workday_id());
                    Shift shift = shiftService.getShiftById(wd.shift_id());
                    return ProfessionalWorkdayMapper.fromDtoToEntity(workday, shift);
                })
                .toList();

        Professional professional = ProfessionalMapper.fromDtoToEntity(dto, specialty, workdays);
        professional.setUser(user);
        workdays.forEach(wd -> wd.setProfessional(professional));

        repository.save(professional);
    }
    public Page<ProfessionalResponseDTO> getListProfessionals(Pageable pagination){
        return repository.findAll(pagination).map(ProfessionalMapper::fromEntityToDtoResponse);
    }

    public List<ProfessionalResponseDTO> getAllProfessionals() {
        return repository.findAll().stream()
                .map(ProfessionalMapper::fromEntityToDtoResponse)
                .collect(Collectors.toList());
    }

    public long getQuantityProfessionals(){
        return repository.count();
    }

    public List<ProfessionalResponseDTO> getTop6Professional(){
        return repository.getTop6Professional().stream().map(ProfessionalMapper::fromEntityToDtoResponse).toList();
    }

    public List<ProfessionalResponseDTO> getProfessionalsBySpecialty(String specialty_id){
        return repository.findBySpecialtyId(specialty_id).stream().map(ProfessionalMapper::fromEntityToDtoResponse).toList();
    }

    public String getIdByUser(String userId) {
        return repository.findByUserId(userId)
                .map(Professional::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profissional não encontrado"));
    }
}
