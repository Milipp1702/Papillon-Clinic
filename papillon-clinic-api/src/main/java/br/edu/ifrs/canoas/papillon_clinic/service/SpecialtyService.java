package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;
import br.edu.ifrs.canoas.papillon_clinic.mapper.SpecialtyMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SpecialtyService {
    @Autowired
    SpecialtyRepository repository;

    public Optional<Specialty> getById(String id){
        return repository.findById(id);
    }

    public List<SpecialtyDTO> getListSpecialties() {
        return repository.findAll().stream()
                .map(SpecialtyMapper::fromEntityToDto)
                .collect(Collectors.toList());
    }
}
