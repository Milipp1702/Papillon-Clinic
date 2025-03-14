package br.edu.ifrs.canoas.papillon_clinic.domain.patient;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.AddressDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianDTO;

import java.time.LocalDate;
import java.util.List;

public record PatientRegisterDTO(String name, LocalDate birthdate,
                                 AddressDTO address, List<GuardianDTO> listGuardian, String observation) {
}
