package br.edu.ifrs.canoas.papillon_clinic.domain.patient;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.AddressDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.GuardianResponseDTO;

import java.time.LocalDate;
import java.util.List;

public record PatientDetailedDTO(String id, String name, LocalDate birthdate,AddressDTO address, List<GuardianResponseDTO> listGuardian, String observation) {
}
