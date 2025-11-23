package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableSlot;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Professional;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Specialty;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentFrequencyRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTests {

    @InjectMocks
    private AppointmentService appointmentService;

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private PatientService patientService;
    @Mock private ProfessionalService professionalService;
    @Mock private AppointmentTypesService appointmentTypesService;
    @Mock private AppointmentFrequencyRepository appointmentFrequencyRepository;
    @Mock private ProfessionalWorkdayService professionalWorkdayService;
    @Mock private EntityManager entityManager;

    private MockedStatic<AppointmentMapper> mockedMapper;

    private Appointment createAppointment() {
        Professional prof = new Professional();
        Specialty sp = new Specialty();
        sp.setName("Fisioterapia");
        prof.setName("Dr. João");
        prof.setSpecialty(sp);

        Patient patient = new Patient();
        patient.setName("Maria");

        AppointmentTypes type = new AppointmentTypes();
        type.setName("Consulta");

        Appointment appointment = new Appointment();
        appointment.setId("1");
        appointment.setProfessional(prof);
        appointment.setPatient(patient);
        appointment.setAppointmentTypes(type);
        appointment.setAppointmentDate(LocalDateTime.now());
        appointment.setPaymentDate(null);

        return appointment;
    }

    @BeforeEach
    void setup() {
        mockedMapper = Mockito.mockStatic(AppointmentMapper.class);
    }

    @AfterEach
    void tearDown() {
        mockedMapper.close();
    }

    // ----------------- getById() -----------------
    @Test
    void getById_ReturnsAppointment() {
        Appointment appointment = new Appointment();
        appointment.setId("123");
        when(appointmentRepository.findById("123")).thenReturn(Optional.of(appointment));

        Optional<Appointment> result = appointmentService.getById("123");

        assertTrue(result.isPresent());
        assertEquals("123", result.get().getId());
    }

    // ----------------- findById() -----------------
    @Test
    void findById_ReturnsDetailedDto() throws Exception {
        Professional prof = new Professional(); prof.setId("p1"); Specialty sp = new Specialty(); sp.setId("s1"); prof.setSpecialty(sp); prof.setName("Maria");
        Appointment appointment = new Appointment(); appointment.setId("1"); appointment.setProfessional(prof);

        when(appointmentRepository.findById("1")).thenReturn(Optional.of(appointment));
        when(professionalService.getById("p1")).thenReturn(Optional.of(prof));

        AppointmentDetailsDTO dto = new AppointmentDetailsDTO("1", LocalDateTime.now(), "PIX", LocalDate.now(), "Obs", "p1", "pat1", "type1", null, "s1", "Maria");
        mockedMapper.when(() -> AppointmentMapper.fromEntityToDtoDetailed(appointment, "s1", "Maria")).thenReturn(dto);

        AppointmentDetailsDTO result = appointmentService.findById("1");

        assertEquals("s1", result.specialtyId());
        assertEquals("Maria", result.professionalName());
    }

    @Test
    void findById_Throws_WhenNotFound() {
        when(appointmentRepository.findById("x")).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> appointmentService.findById("x"));
    }

    // ----------------- generateDatesFromFrequency() -----------------
    @Test
    void generateDatesFromFrequency_GeneratesCorrectDates() {
        LocalDateTime start = LocalDateTime.now();

        AppointmentFrequency daily = new AppointmentFrequency();
        daily.setFrequency(Frequency.DIARIA); daily.setFrequency_interval(1); daily.setEnd_date(start.toLocalDate().plusDays(3));
        List<LocalDateTime> dailyDates = appointmentService.generateDatesFromFrequency(daily, start);
        assertEquals(3, dailyDates.size());

        AppointmentFrequency weekly = new AppointmentFrequency();
        weekly.setFrequency(Frequency.SEMANAL); weekly.setFrequency_interval(1); weekly.setEnd_date(start.toLocalDate().plusWeeks(3));
        List<LocalDateTime> weeklyDates = appointmentService.generateDatesFromFrequency(weekly, start);
        assertEquals(3, weeklyDates.size());

        AppointmentFrequency monthly = new AppointmentFrequency();
        monthly.setFrequency(Frequency.MENSAL); monthly.setFrequency_interval(1); monthly.setEnd_date(start.toLocalDate().plusMonths(3));
        List<LocalDateTime> monthlyDates = appointmentService.generateDatesFromFrequency(monthly, start);
        assertEquals(3, monthlyDates.size());
    }

    // ----------------- registerAppointment() -----------------
    @Test
    void registerAppointment_SavesAppointment_WhenSlotAvailable() throws Exception {
        Patient patient = new Patient(); patient.setId("pa1");
        Professional professional = new Professional(); professional.setId("pr1"); Specialty sp = new Specialty(); sp.setId("sx1"); professional.setSpecialty(sp);
        AppointmentTypes type = new AppointmentTypes(); type.setId("t1");

        LocalDateTime date = LocalDateTime.of(2025,1,10,10,0);
        AppointmentDTO dto = new AppointmentDTO(null, date, "PIX", null, "Obs", "pr1", "pa1", "t1", null);

        AvailableSlot slot = new AvailableSlot(date.toLocalDate(), date.toLocalTime(), "pr1", "Maria", "sx1");
        when(professionalWorkdayService.getAllAvailableSlots(date.toLocalDate(), "sx1", List.of("pr1"))).thenReturn(List.of(slot));
        when(patientService.getById("pa1")).thenReturn(Optional.of(patient));
        when(professionalService.getById("pr1")).thenReturn(Optional.of(professional));
        when(appointmentTypesService.getById("t1")).thenReturn(Optional.of(type));
        mockedMapper.when(() -> AppointmentMapper.fromDtoToEntity(dto, type, patient, professional, null)).thenReturn(new Appointment());

        List<LocalDateTime> result = appointmentService.registerAppointment(dto);

        assertTrue(result.isEmpty());
        verify(appointmentRepository, times(1)).save(any());
    }

    @Test
    void registerAppointment_ReturnsUnavailable_WhenSlotUnavailable() {
        Patient patient = new Patient(); patient.setId("pa1");
        Professional professional = new Professional(); professional.setId("pr1"); Specialty sp = new Specialty(); sp.setId("sx1"); professional.setSpecialty(sp);
        AppointmentTypes type = new AppointmentTypes(); type.setId("t1");

        LocalDateTime date = LocalDateTime.of(2025,1,10,10,0);
        AppointmentDTO dto = new AppointmentDTO(null, date, "PIX", null, "Obs", "pr1", "pa1", "t1", null);

        when(professionalWorkdayService.getAllAvailableSlots(date.toLocalDate(), "sx1", List.of("pr1"))).thenReturn(List.of());
        when(patientService.getById("pa1")).thenReturn(Optional.of(patient));
        when(professionalService.getById("pr1")).thenReturn(Optional.of(professional));
        when(appointmentTypesService.getById("t1")).thenReturn(Optional.of(type));

        Exception exception = assertThrows(Exception.class, () -> appointmentService.registerAppointment(dto));
        assertEquals("Horário indisponível para o profissional selecionado!", exception.getMessage());
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void registerAppointment_Throws_WhenPatientNotFound() {
        AppointmentDTO dto = new AppointmentDTO(null, LocalDateTime.now(), "PIX", null, "Obs", "pr1", "pa1", "t1", null);
        when(patientService.getById("pa1")).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> appointmentService.registerAppointment(dto));
    }

    // ----------------- updateAppointment() -----------------
    @Test
    void updateAppointment_Throws_WhenAppointmentNotFound() {
        AppointmentDTO dto = new AppointmentDTO("x", LocalDateTime.now(), "PIX", null, "", "p1", "pa1", "t1", null);
        when(appointmentRepository.findById("x")).thenReturn(Optional.empty());
        Exception ex = assertThrows(Exception.class, () -> appointmentService.updateAppointment(dto));
        assertEquals("Appointment not found", ex.getMessage());
    }

    @Test
    void updateAppointment_WithFrequencyChanges_CallsRegenerate() throws Exception {
        Appointment existing = new Appointment(); existing.setId("a1"); existing.assignFrequency(null);
        Professional professional = new Professional(); professional.setId("p1"); Specialty sp = new Specialty(); sp.setId("sx1"); professional.setSpecialty(sp);
        Patient patient = new Patient(); patient.setId("pa1");
        AppointmentTypes type = new AppointmentTypes(); type.setId("t1");
        AppointmentFrequencyDTO freqDto = new AppointmentFrequencyDTO(
                null,
                LocalDate.now().plusDays(1),
                Frequency.DIARIA,
                1
        );
        AppointmentDTO dto = new AppointmentDTO("a1", LocalDateTime.now(), "PIX", null, "Obs", "p1", "pa1", "t1", freqDto);

        when(appointmentRepository.findById("a1")).thenReturn(Optional.of(existing));
        when(professionalService.getById("p1")).thenReturn(Optional.of(professional));
        when(patientService.getById("pa1")).thenReturn(Optional.of(patient));
        when(appointmentTypesService.getById("t1")).thenReturn(Optional.of(type));
        when(appointmentFrequencyRepository.save(any())).thenAnswer(invocation -> {
            AppointmentFrequency f = new AppointmentFrequency();
            f.setFrequency(Frequency.DIARIA);
            f.setFrequency_interval(1);
            f.setEnd_date(LocalDate.now().plusDays(3));
            f.setId("f1");
            return f;
        });

        List<LocalDateTime> skipped = appointmentService.updateAppointment(dto);
        assertNotNull(skipped);
    }

    // ----------------- deleteAppointment() -----------------
    @Test
    void deleteAppointment_DeletesAppointmentAndFrequency() throws Exception {
        AppointmentFrequency freq = new AppointmentFrequency();
        freq.setId("f1");

        Appointment appointment = new Appointment();
        appointment.setId("a1");
        appointment.assignFrequency(freq);

        Appointment future1 = new Appointment();
        future1.setId("fut1");
        Appointment future2 = new Appointment();
        future2.setId("fut2");

        when(appointmentRepository.findById("a1")).thenReturn(Optional.of(appointment));

        when(appointmentRepository.findByFrequency_IdAndAppointmentDateAfterAndPaymentDateIsNull(
                eq("f1"),
                any(LocalDateTime.class)
        )).thenReturn(List.of(future1, future2));

        appointmentService.deleteAppointment("a1", true);

        verify(appointmentRepository).delete(appointment);
        verify(appointmentRepository).deleteAll(List.of(future1, future2));
        verify(appointmentFrequencyRepository).delete(freq);
    }


    @Test
    void deleteAppointment_Throws_WhenNotFound() {
        when(appointmentRepository.findById("x")).thenReturn(Optional.empty());
        Exception ex = assertThrows(Exception.class, () -> appointmentService.deleteAppointment("x", true));
        assertEquals("Appointment not found", ex.getMessage());
    }

    // ----------------- getListAppointments() -----------------
    @Test
    void getListAppointments_ReturnsPage() {
        Appointment appt = new Appointment();
        Page<Appointment> page = new PageImpl<>(List.of(appt));
        when(appointmentRepository.findAll(any(Pageable.class))).thenReturn(page);
        mockedMapper.when(() -> AppointmentMapper.fromEntityToDtoResponse(appt)).thenReturn(new AppointmentResponseDTO("id","prof","pat","type",LocalDateTime.now(),false,"sx"));

        Page<AppointmentResponseDTO> result = appointmentService.getListAppointments(PageRequest.of(0,10));
        assertEquals(1, result.getTotalElements());
    }

    // ----------------- getAppointmentsForCalendar() -----------------
    @Test
    void getAppointmentsForCalendar_WithEmptyList_CallsFindAll() {
        Appointment appt = new Appointment();
        when(appointmentRepository.findAll()).thenReturn(List.of(appt));
        mockedMapper.when(() -> AppointmentMapper.fromEntityToDtoResponse(appt)).thenReturn(new AppointmentResponseDTO("id","prof","pat","type",LocalDateTime.now(),false,"sx"));
        List<AppointmentResponseDTO> result = appointmentService.getAppointmentsForCalendar(List.of());
        assertEquals(1, result.size());
    }

    // ----------------- getAppointmentFinancials() -----------------
    @Test
    void getAppointmentFinancials_ReturnsMappedList() {
        Object[] row1 = new Object[] {
                Timestamp.valueOf(LocalDateTime.now()),
                "Paciente 1",
                "Profissional 1",
                "Consulta",
                "Fisioterapia",
                new BigDecimal("100"),
                1L,
                new BigDecimal("10")
        };

        Object[] row2 = new Object[] {
                Timestamp.valueOf(LocalDateTime.now().minusDays(1)),
                "Paciente 2",
                "Profissional 2",
                "Terapia",
                "Psicologia",
                new BigDecimal("200"),
                2L,
                new BigDecimal("20")
        };

        // Mock do Query
        Query queryMock = mock(Query.class);
        when(entityManager.createNativeQuery(anyString())).thenReturn(queryMock);
        when(queryMock.setParameter(anyString(), any())).thenReturn(queryMock);

        // Lista de linhas (cada linha é Object[])
        List<Object[]> resultList = new ArrayList<>();
        resultList.add(row1);
        resultList.add(row2);

        when(queryMock.getResultList()).thenReturn(resultList);

        // Executa o método real
        List<AppointmentFinancialDTO> dtos = appointmentService.getAppointmentFinancials("pa","pr");

        // Valida os resultados
        assertEquals(2, dtos.size());

        // Primeira linha
        assertEquals("Paciente 1", dtos.get(0).patientName());
        assertEquals(new BigDecimal("90.0"), dtos.get(0).amountProfessional());

        // Segunda linha
        assertEquals("Paciente 2", dtos.get(1).patientName());
        assertEquals(new BigDecimal("160.0"), dtos.get(1).amountProfessional());
    }

    @Test
    void handleFrequencyUpdate_UpdatesExistingFrequency() throws Exception {
        // Appointment já existente
        Appointment existing = new Appointment();
        existing.assignFrequency(new AppointmentFrequency());

        // DTO que vai atualizar
        AppointmentFrequencyDTO dto = new AppointmentFrequencyDTO("f1", LocalDate.now().plusDays(1), Frequency.DIARIA, 1);
        AppointmentDTO appointmentDto = new AppointmentDTO("1", LocalDateTime.now(), "PIX", null, "", "p1", "pa1", "t1", dto);

        // Mock serviços
        Professional prof = new Professional();
        prof.setId("p1");
        Specialty sp = new Specialty();
        sp.setId("sp1");
        sp.setName("Specialty");

        prof.setSpecialty(sp);

        when(professionalService.getById("p1")).thenReturn(Optional.of(prof));
        when(patientService.getById("pa1")).thenReturn(Optional.of(new Patient()));
        when(appointmentTypesService.getById("t1")).thenReturn(Optional.of(new AppointmentTypes()));

        // Mock do repositório para retornar o appointment existente
        when(appointmentRepository.findById("1")).thenReturn(Optional.of(existing));

        // Mock do repositório de frequência
        when(appointmentFrequencyRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Cria uma frequência f1
        AppointmentFrequency existingFrequency = new AppointmentFrequency();
        existingFrequency.setId("f1");
        existingFrequency.setFrequency(Frequency.DIARIA); // ou o valor que precisar

        // Mock para o repositório de frequência
        when(appointmentFrequencyRepository.findById("f1"))
                .thenReturn(Optional.of(existingFrequency));

        // Executa o método
        List<LocalDateTime> skipped = appointmentService.updateAppointment(appointmentDto);

        // Verifica
        assertNotNull(skipped);
    }


    // ----------------- getQuantityAppointments() -----------------
    @Test
    void getQuantityAppointments_ReturnsSize() {
        when(appointmentRepository.findByAppointmentDateBetween(any(), any())).thenReturn(List.of(new Appointment(), new Appointment()));
        long qty = appointmentService.getQuantityAppointments();
        assertEquals(2, qty);
    }

    @Test
    void search_WithDateQuery_ReturnsAppointments() {
        Appointment appointment = createAppointment();
        appointment.setAppointmentDate(LocalDateTime.now());

        when(appointmentRepository.findByAppointmentDateBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(appointment));

        Page<AppointmentResponseDTO> result = appointmentService.search(
                LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("Dr. João", result.getContent().get(0).professionalName());
    }

    @Test
    void search_WithPagoQuery_ReturnsPaidAppointments() {
        Appointment appointment = createAppointment();
        appointment.setPaymentDate(LocalDate.now());

        when(appointmentRepository.findByPaymentDateIsNotNull(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(appointment)));

        Page<AppointmentResponseDTO> result = appointmentService.search("pago", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).isPaid());
    }

    @Test
    void search_WithTextQuery_ReturnsMatchingAppointments() {
        Appointment appointment = createAppointment();

        when(appointmentRepository.findByProfessionalNameContainingIgnoreCaseOrPatientNameContainingIgnoreCaseOrAppointmentTypesNameContainingIgnoreCaseOrProfessionalSpecialtyNameContainingIgnoreCase(
                eq("Maria"), eq("Maria"), eq("Maria"), eq("Maria"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(appointment)));

        Page<AppointmentResponseDTO> result = appointmentService.search("Maria", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("Maria", result.getContent().get(0).patientName());
    }

    @Test
    void getListAppointmentsForProfessional_ReturnsMappedPage() {
        // Arrange
        String userId = "prof1";
        Pageable pageable = PageRequest.of(0, 10);

        Appointment appointment = createAppointment();
        Page<Appointment> appointmentsPage = new PageImpl<>(List.of(appointment));

        // Mock do repository
        when(appointmentRepository.findByProfessional_UserId(eq(userId), any(Pageable.class)))
                .thenReturn(appointmentsPage);

        // Mock do mapper
        mockedMapper.when(() -> AppointmentMapper.fromEntityToDtoResponse(appointment))
                .thenReturn(new AppointmentResponseDTO(
                        "id",
                        "Dr. João",
                        "Maria",
                        "Consulta",
                        LocalDateTime.now(),
                        false,
                        "Fisioterapia"
                ));

        Page<AppointmentResponseDTO> result = appointmentService.getListAppointmentsForProfessional(pageable, userId);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AppointmentResponseDTO dto = result.getContent().get(0);
        assertEquals("Dr. João", dto.professionalName());
        assertEquals("Maria", dto.patientName());
    }

}

