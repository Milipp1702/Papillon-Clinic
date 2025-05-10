package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;
import br.edu.ifrs.canoas.papillon_clinic.mapper.ProfessionalMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.ProfessionalWorkdayMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void registerProfessional(ProfessionalDTO professionalDTO) throws Exception {
        Optional<Specialty> specialty = specialtyService.getById(professionalDTO.specialty_id());
        if(specialty.isEmpty()){
            throw new Exception("Specialty not Found");
        }
        List<ProfessionalWorkday> workdays = professionalDTO.workdays().stream()
                .map(dto -> {
                    System.out.println("help");
                    WorkDay workday = workdayService.getWorkdayById(dto.workday_id());
                    System.out.println(workday);
                    Shift shift = shiftService.getShiftById(dto.shift_id());
                    System.out.println(shift);
                    return ProfessionalWorkdayMapper.fromDtoToEntity(workday, shift);
                })
                .toList();

        Professional newProfessional = ProfessionalMapper.fromDtoToEntity(professionalDTO, specialty.get(), workdays);
        workdays.forEach(workday -> workday.setProfessional(newProfessional));

        repository.save(newProfessional);
    }
    public Page<ProfessionalResponseDTO> getListProfessionals(Pageable pagination){
        return repository.findAll(pagination).map(ProfessionalMapper::fromEntityToDtoResponse);
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
}
