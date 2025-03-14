package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.ProfessionalResponseDTO;
import br.edu.ifrs.canoas.papillon_clinic.mapper.ProfessionalMapper;
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
        Professional newProfessional = oldProfessional.get();
        newProfessional.setPhone_number(professional.phone_number());
        newProfessional.setName(professional.name());
        newProfessional.setCpf(professional.cpf());
        newProfessional.setDiscount(professional.discount());
        newProfessional.setCrm(professional.crm());
        newProfessional.setSpeciality(professional.speciality());
        repository.save(newProfessional);
    }

    public void registerProfessional(ProfessionalDTO professionalDTO){
        Professional newProfessional = ProfessionalMapper.fromDtoToEntity(professionalDTO);
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
}
