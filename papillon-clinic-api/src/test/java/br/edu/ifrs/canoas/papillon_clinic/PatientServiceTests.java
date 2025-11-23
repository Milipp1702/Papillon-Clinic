package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.address.Address;
import br.edu.ifrs.canoas.papillon_clinic.domain.address.AddressDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.guardian.Guardian;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.PatientRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.PatientService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTests {

    @InjectMocks
    private PatientService patientService;

    @Mock private PatientRepository patientRepository;
    @Mock private AppointmentRepository appointmentRepository;

    private Patient createPatient() {
        Patient p = new Patient();
        p.setId("1");
        p.setName("Maria");
        p.setAge(30);
        p.setActive(true);

        Address address = new Address();
        address.setStreet("Rua Teste");
        address.setNumber(123);
        address.setNeighborhood("Bairro X");
        address.setCity("Cidade Y");
        p.setAddress(address);

        Guardian g = new Guardian();
        g.setName("João");
        g.setMain(true);
        p.setGuardians(List.of(g));

        return p;
    }

    // ----------------- getById -----------------
    @Test
    void getById_ReturnsPatient_WhenActive() {
        Patient patient = createPatient();
        when(patientRepository.findById("1")).thenReturn(Optional.of(patient));

        Optional<Patient> result = patientService.getById("1");

        assertTrue(result.isPresent());
        assertEquals("Maria", result.get().getName());
    }

    @Test
    void getById_ReturnsEmpty_WhenInactive() {
        Patient patient = createPatient();
        patient.setActive(false);
        when(patientRepository.findById("1")).thenReturn(Optional.of(patient));

        Optional<Patient> result = patientService.getById("1");

        assertTrue(result.isEmpty());
    }

    // ----------------- findById -----------------
    @Test
    void findById_ReturnsDetailedDto() throws Exception {
        Patient patient = createPatient();
        when(patientRepository.findById("1")).thenReturn(Optional.of(patient));

        PatientDetailedDTO dto = patientService.findById("1");

        assertEquals("Maria", dto.name());
        assertEquals("Rua Teste", dto.address().street());
    }

    @Test
    void findById_Throws_WhenNotFound() {
        when(patientRepository.findById("x")).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> patientService.findById("x"));
    }

    // ----------------- registerPatient -----------------
    @Test
    void registerPatient_SavesNewPatient() throws Exception {
        PatientRegisterDTO dto = new PatientRegisterDTO(
                "Maria",
                "1990-01-01",
                "12345678900",
                new AddressDTO("Rua Teste", 123, "Bairro X", "Cidade Y", "Complemento"),
                List.of(),
                "Observação teste"
        );

        when(patientRepository.findByNameAndBirthdate(anyString(), any())).thenReturn(Optional.empty());

        patientService.registerPatient(dto);

        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    void registerPatient_Throws_WhenPatientExistsAndActive() {
        Patient existing = createPatient();
        when(patientRepository.findByNameAndBirthdate(anyString(), any())).thenReturn(Optional.of(existing));

        PatientRegisterDTO dto = new PatientRegisterDTO(
                "Maria",
                "1990-01-01",
                "12345678900",
                new AddressDTO("Rua Teste", 123, "Bairro X", "Cidade Y", "Complemento"),
                List.of(),
                "Alguma observação"
        );

        Exception ex = assertThrows(Exception.class, () -> patientService.registerPatient(dto));
        assertEquals("Paciente já existe!", ex.getMessage());
    }

    // ----------------- softDeletePatient -----------------
    @Test
    void softDeletePatient_SetsInactive() throws Exception {
        Patient patient = createPatient();
        when(patientRepository.findById("1")).thenReturn(Optional.of(patient));
        when(appointmentRepository.findByPatient_IdAndAppointmentDateAfterAndPaymentDateIsNull(eq("1"), any()))
                .thenReturn(List.of());

        patientService.softDeletePatient("1");

        assertFalse(patient.isActive());
        verify(patientRepository, times(1)).save(patient);
    }

    @Test
    void softDeletePatient_Throws_WhenNotFound() {
        when(patientRepository.findById("x")).thenReturn(Optional.empty());
        Exception ex = assertThrows(Exception.class, () -> patientService.softDeletePatient("x"));
        assertEquals("Paciente não encontrado ou já está inativo!", ex.getMessage());
    }

    // ----------------- search -----------------
    @Test
    void search_ReturnsPatientsPage() {
        Patient patient = createPatient();
        Page<Patient> page = new PageImpl<>(List.of(patient));

        when(patientRepository
                .findByNameContainingIgnoreCaseOrAgeOrGuardiansNameContainingIgnoreCaseAndGuardiansMainTrue(
                        anyString(), any(), anyString(), any(Pageable.class)))
                .thenReturn(page);

        Page<PatientResponseDTO> result = patientService.search("Maria", PageRequest.of(0,10));

        assertEquals(1, result.getTotalElements());
        assertEquals("Maria", result.getContent().get(0).name());
    }

    @Test
    void updatePatient_UpdatesFields() throws Exception {
        Patient existingPatient = new Patient();
        existingPatient.setId("p1");
        existingPatient.setName("Maria");
        existingPatient.setCpf("12345678900");
        existingPatient.setBirthdate(LocalDate.of(1990, 1, 1));
        existingPatient.setAge(33);
        existingPatient.setAddress(new Address());
        existingPatient.setGuardians(List.of());
        existingPatient.setObservation("Observação antiga");

        when(patientRepository.findById("p1")).thenReturn(Optional.of(existingPatient));

        PatientDetailedDTO dto = new PatientDetailedDTO(
                "p1",
                "Maria Updated",
                "98765432100",
                LocalDate.of(1992, 2, 2),
                new AddressDTO("Rua Nova", 123, "Bairro Y", "Cidade Z", "Complemento"),
                List.of(),
                "Observação nova"
        );

        patientService.updatePatient(dto);

        verify(patientRepository, times(1)).save(any(Patient.class));

        assertEquals("Maria Updated", existingPatient.getName());
        assertEquals("98765432100", existingPatient.getCpf());
        assertEquals(LocalDate.of(1992, 2, 2), existingPatient.getBirthdate());
        assertEquals("Rua Nova", existingPatient.getAddress().getStreet());
        assertEquals("Observação nova", existingPatient.getObservation());
    }

    @Test
    void getListPatients_ReturnsPage() {
        Patient patient = createPatient();

        Page<Patient> page = new PageImpl<>(List.of(patient));

        when(patientRepository.findByActiveTrue(any(Pageable.class))).thenReturn(page);

        Page<PatientResponseDTO> result = patientService.getListPatients(PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("Maria", result.getContent().get(0).name());
    }

    @Test
    void getAllPatients_ReturnsList() {
        Patient patient = createPatient();

        when(patientRepository.findByActiveTrue()).thenReturn(List.of(patient));

        List<PatientResponseDTO> result = patientService.getAllPatients();

        assertEquals(1, result.size());
        assertEquals("Maria", result.get(0).name());
    }

    @Test
    void getQuantityPatients_ReturnsCount() {
        when(patientRepository.count()).thenReturn(5L);

        long result = patientService.getQuantityPatients();

        assertEquals(5, result);
        verify(patientRepository, times(1)).count();
    }

    @Test
    void registerPatient_ReactivatesInactivePatient() {
        Patient existingPatient = new Patient();
        existingPatient.setId("p1");
        existingPatient.setName("Maria");
        existingPatient.setActive(false);

        // DTO de cadastro
        AddressDTO address = new AddressDTO(
                "Rua Teste",
                123,
                "Bairro X",
                "Cidade Y",
                "Complemento"
        );

        PatientRegisterDTO dto = new PatientRegisterDTO(
                "Maria",
                "1990-01-01",
                "12345678900",
                address,
                List.of(),
                "Observação teste"
        );

        when(patientRepository.findByNameAndBirthdate(anyString(), any())).thenReturn(Optional.of(existingPatient));

        Exception ex = assertThrows(Exception.class, () -> patientService.registerPatient(dto));

        assertTrue(existingPatient.isActive());
        assertEquals("Paciente reativado!", ex.getMessage());

        verify(patientRepository, times(1)).save(existingPatient);
    }

    @Test
    void updatePatient_Throws_WhenPatientNotFound() {
        PatientDetailedDTO dto = new PatientDetailedDTO(
                "nonexistent-id",
                "Maria",
                "12345678900",
                LocalDate.of(1990, 1, 1),
                null,
                List.of(),
                "Observação"
        );

        when(patientRepository.findById("nonexistent-id")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> patientService.updatePatient(dto));

        verify(patientRepository, never()).save(any());
    }
}

