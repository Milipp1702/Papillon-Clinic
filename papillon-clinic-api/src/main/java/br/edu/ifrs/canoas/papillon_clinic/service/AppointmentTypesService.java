package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypeDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypes;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentTypeMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentTypesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentTypesService {
    @Autowired
    AppointmentTypesRepository repository;

    public Optional<AppointmentTypes> getById(String id){
        return repository.findById(id);
    }
}
