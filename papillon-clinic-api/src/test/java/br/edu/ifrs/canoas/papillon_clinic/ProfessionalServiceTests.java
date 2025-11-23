package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.Appointment;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.UserRole;
import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkDay;
import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.domain.user.User;
import br.edu.ifrs.canoas.papillon_clinic.repository.*;
import br.edu.ifrs.canoas.papillon_clinic.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProfessionalServiceTests {

    @InjectMocks
    private ProfessionalService service;

    @Mock private ProfessionalRepository repository;
    @Mock private SpecialtyService specialtyService;
    @Mock private WorkdayService workdayService;
    @Mock private ShiftService shiftService;
    @Mock private AuthorizationService authorizationService;
    @Mock private ProfessionalWorkdayRepository professionalWorkdayRepository;
    @Mock private AppointmentRepository appointmentRepository;

    @BeforeEach
    void setup() { MockitoAnnotations.openMocks(this); }

    @Test
    void findById_ReturnsDTO_WhenExists() throws Exception {
        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setWorkdays(new ArrayList<>());

        Specialty spec = new Specialty();
        spec.setId("S1");
        spec.setName("Fisioterapia");

        prof.setSpecialty(spec);

        when(repository.findById("p1")).thenReturn(Optional.of(prof));

        var dto = service.findById("p1");

        assertEquals("p1", dto.id());
        assertEquals("Maria", dto.name());
    }

    @Test
    void findById_Throws_WhenNotFound() {
        when(repository.findById("x")).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> service.findById("x"));
    }

    @Test
    void updateProfessional_UpdatesFieldsAndWorkdays() throws Exception {
        Professional existing = new Professional();
        existing.setId("p1");
        existing.setWorkdays(new ArrayList<>());
        when(repository.findById("p1")).thenReturn(Optional.of(existing));

        Specialty spec = new Specialty();
        spec.setId("s1");
        when(specialtyService.getById("s1")).thenReturn(Optional.of(spec));

        WorkDay day = new WorkDay();
        day.setDay("segunda");
        when(workdayService.getWorkdayById("1L")).thenReturn(day);

        Shift shift = new Shift();
        shift.setStart_time(LocalTime.parse("08:00"));
        shift.setEnd_time(LocalTime.parse("12:00"));
        when(shiftService.getShiftById("10L")).thenReturn(shift);

        ProfessionalWorkdayDTO wdDTO = new ProfessionalWorkdayDTO(null, "1L", "10L");

        ProfessionalDTO dto = new ProfessionalDTO(
                "p1",
                "Maria",
                "123",
                "email@test.com",
                "reg",
                "s1",
                "999",
                20,
                List.of(wdDTO)
        );

        service.updateProfessional(dto);

        verify(repository, times(1)).save(any(Professional.class));
        verify(professionalWorkdayRepository, times(1)).deleteAllByProfessionalId("p1");
        assertEquals(1, existing.getWorkdays().size());
    }

    @Test
    void registerProfessional_InsertsNew_WhenNotExists() throws Exception {
        when(repository.findByEmail("a@a.com")).thenReturn(Optional.empty());

        Specialty spec = new Specialty(); spec.setId("s1");
        when(specialtyService.getById("s1")).thenReturn(Optional.of(spec));

        User user = new User("123", "email@ex.com", UserRole.USER);
        when(authorizationService.registerUser("a@a.com")).thenReturn(user);

        WorkDay wd = new WorkDay(); wd.setDay("terça");
        Shift sh = new Shift();
        sh.setStart_time(LocalTime.parse("08:00"));
        when(workdayService.getWorkdayById("1L")).thenReturn(wd);
        when(shiftService.getShiftById("2L")).thenReturn(sh);

        ProfessionalDTO dto = new ProfessionalDTO(
                null, "Maria", "123", "a@a.com", "999", "s1", "reg",
                20, List.of(new ProfessionalWorkdayDTO(null,"1L", "2L"))
        );

        service.registerProfessional(dto);
        verify(repository).save(any(Professional.class));
    }

    @Test
    void softDeleteProfessional_MarksInactiveAndDeletesFutureAppointments() throws Exception {
        Professional p = new Professional();
        p.setId("p1"); p.setActive(true);
        when(repository.findById("p1")).thenReturn(Optional.of(p));

        Appointment app = new Appointment();
        when(appointmentRepository
                .findByProfessional_IdAndAppointmentDateAfterAndPaymentDateIsNull(eq("p1"), any(LocalDateTime.class)))
                .thenReturn(List.of(app));

        service.softDeleteProfessional("p1");

        verify(appointmentRepository).deleteAll(List.of(app));
        assertFalse(p.isActive());
        verify(repository).save(p);
    }

    @Test
    void getIdByUser_ReturnsId_WhenExists() {
        Professional p = new Professional(); p.setId("p1");
        when(repository.findByUserIdAndActiveTrue("u1")).thenReturn(Optional.of(p));

        String result = service.getIdByUser("u1");
        assertEquals("p1", result);
    }

    @Test
    void getIdByUser_Throws_WhenNotFound() {
        when(repository.findByUserIdAndActiveTrue("x")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.getIdByUser("x"));
    }

    @Test
    void getListProfessionals_ReturnsPagedDTOs() {
        Pageable pageable = PageRequest.of(0, 10);

        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setCpf("123");

        Specialty spec = new Specialty();
        spec.setName("Fisioterapia");
        prof.setSpecialty(spec);

        Page<Professional> page = new PageImpl<>(List.of(prof));
        when(repository.findByActiveTrue(pageable)).thenReturn(page);

        Page<ProfessionalResponseDTO> result = service.getListProfessionals(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("p1", result.getContent().get(0).id());
        assertEquals("Maria", result.getContent().get(0).name());
        assertEquals("123", result.getContent().get(0).cpf());
        assertEquals("Fisioterapia", result.getContent().get(0).specialty());
    }

    @Test
    void search_ReturnsFilteredProfessionalDTOs() {
        Pageable pageable = PageRequest.of(0, 10);
        String query = "maria";

        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setCpf("123");

        Specialty spec = new Specialty();
        spec.setName("TO");
        prof.setSpecialty(spec);

        Page<Professional> page = new PageImpl<>(List.of(prof));

        when(repository
                .findByNameContainingIgnoreCaseOrCpfContainingIgnoreCaseOrSpecialtyNameContainingIgnoreCase(
                        query, query, query, pageable))
                .thenReturn(page);

        Page<ProfessionalResponseDTO> result = service.search(query, pageable);

        assertEquals(1, result.getTotalElements());
        ProfessionalResponseDTO dto = result.getContent().get(0);

        assertEquals("p1", dto.id());
        assertEquals("Maria", dto.name());
        assertEquals("123", dto.cpf());
        assertEquals("TO", dto.specialty());
    }

    @Test
    void getAllProfessionals_ReturnsListOfDTOs() {
        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setCpf("123");

        Specialty spec = new Specialty();
        spec.setName("TO");
        prof.setSpecialty(spec);

        when(repository.findByActiveTrue()).thenReturn(List.of(prof));

        List<ProfessionalResponseDTO> result = service.getAllProfessionals();

        assertEquals(1, result.size());
        assertEquals("p1", result.get(0).id());
        assertEquals("Maria", result.get(0).name());
        assertEquals("123", result.get(0).cpf());
        assertEquals("TO", result.get(0).specialty());
    }

    @Test
    void getQuantityProfessionals_ReturnsCount() {
        when(repository.count()).thenReturn(5L);

        long result = service.getQuantityProfessionals();

        assertEquals(5L, result);
        verify(repository, times(1)).count();
    }

    @Test
    void getTop6Professional_ReturnsDTOList() {
        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setCpf("123");

        Specialty spec = new Specialty();
        spec.setName("TO");
        prof.setSpecialty(spec);

        when(repository.getTop6Professional()).thenReturn(List.of(prof));

        List<ProfessionalResponseDTO> result = service.getTop6Professional();

        assertEquals(1, result.size());
        assertEquals("p1", result.get(0).id());
        assertEquals("Maria", result.get(0).name());
        assertEquals("123", result.get(0).cpf());
        assertEquals("TO", result.get(0).specialty());

        verify(repository, times(1)).getTop6Professional();
    }

    @Test
    void getProfessionalsBySpecialty_ReturnsDTOList() {
        String specialtyId = "s1";

        Professional prof = new Professional();
        prof.setId("p1");
        prof.setName("Maria");
        prof.setCpf("123");

        Specialty spec = new Specialty();
        spec.setId("s1");
        spec.setName("TO");
        prof.setSpecialty(spec);

        when(repository.findBySpecialtyIdAndActiveTrue(specialtyId))
                .thenReturn(List.of(prof));

        List<ProfessionalResponseDTO> result = service.getProfessionalsBySpecialty(specialtyId);

        assertEquals(1, result.size());
        assertEquals("p1", result.get(0).id());
        assertEquals("Maria", result.get(0).name());
        assertEquals("123", result.get(0).cpf());
        assertEquals("TO", result.get(0).specialty());

        verify(repository, times(1)).findBySpecialtyIdAndActiveTrue(specialtyId);
    }

}
