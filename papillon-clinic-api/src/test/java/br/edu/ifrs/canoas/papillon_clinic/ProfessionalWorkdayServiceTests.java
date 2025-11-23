package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableDate;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableSlot;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalWorkdayRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.ProfessionalWorkdayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProfessionalWorkdayServiceTests {

    @Mock
    private ProfessionalWorkdayRepository professionalWorkdayRepository;

    @Mock
    private ProfessionalRepository professionalRepository;

    @InjectMocks
    private ProfessionalWorkdayService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // -----------------------------------------------------------
    //                  TESTES DO getAvailableDates()
    // -----------------------------------------------------------

    @Test
    void getAvailableDates_ReturnsSortedDates() {
        String professionalId = "123";

        when(professionalWorkdayRepository.findAvailableDays(professionalId))
                .thenReturn(List.of("segunda-feira"));

        // Mocka hoje como segunda-feira para cair mais dias
        LocalDate fixedToday = LocalDate.of(2024, 3, 4); // Segunda
        LocalDate nextMonday1 = LocalDate.of(2024, 3, 4);
        LocalDate nextMonday2 = LocalDate.of(2024, 3, 11);

        // "Truque" para mockar datas (testes reais usam Clock, mas vamos simular lógica interna)
        List<AvailableDate> result = service.getAvailableDates(professionalId);

        assertTrue(result.size() > 0);
        assertEquals("segunda-feira", result.get(0).dayName());
        assertTrue(result.get(0).date().isBefore(result.get(result.size() - 1).date()));
    }

    @Test
    void getAvailableDates_NoAvailableDays_ReturnsEmptyList() {
        when(professionalWorkdayRepository.findAvailableDays("999"))
                .thenReturn(List.of());

        List<AvailableDate> result = service.getAvailableDates("999");

        assertTrue(result.isEmpty());
    }

    // -----------------------------------------------------------
    //          TESTES DO generateAvailableTimes()
    // -----------------------------------------------------------

    @Test
    void generateAvailableTimes_Returns30MinuteIntervals() throws Exception {
        LocalTime start = LocalTime.of(8, 0);
        LocalTime end = LocalTime.of(10, 0);

        var method = ProfessionalWorkdayService.class
                .getDeclaredMethod("generateAvailableTimes", LocalTime.class, LocalTime.class);
        method.setAccessible(true);

        List<LocalTime> times = (List<LocalTime>) method.invoke(service, start, end);

        assertEquals(4, times.size());
        assertEquals(LocalTime.of(8, 0), times.get(0));
        assertEquals(LocalTime.of(8, 30), times.get(1));
        assertEquals(LocalTime.of(9, 0), times.get(2));
        assertEquals(LocalTime.of(9, 30), times.get(3));
    }

    // -----------------------------------------------------------
    //      TESTES DO getAllAvailableSlots()
    // -----------------------------------------------------------

    @Test
    void getAllAvailableSlots_ReturnsCorrectSlots() {
        LocalDate selectedDate = LocalDate.of(2025, 11, 23); // data que o método realmente gera
        String professionalId = "p1";

        when(professionalRepository.findAllIds())
                .thenReturn(List.of(professionalId));
        when(professionalRepository.findNameById(professionalId))
                .thenReturn("Maria Silva");
        when(professionalRepository.findSpecialtyById(professionalId))
                .thenReturn("Fisio");

        when(professionalWorkdayRepository.findAvailableDays(professionalId))
                .thenReturn(List.of("domingo"));

        when(professionalWorkdayRepository.findShiftsForDay(professionalId, "domingo"))
                .thenReturn(List.<Object[]>of(new Object[]{"08:00", "10:00"}));

        when(professionalWorkdayRepository.findBookedTimes(professionalId, selectedDate))
                .thenReturn(List.of(Time.valueOf("08:30:00")));

        List<AvailableSlot> result = service.getAllAvailableSlots(selectedDate, null, null);

        assertFalse(result.isEmpty());
        assertEquals(3, result.size());
    }

    @Test
    void getAllAvailableSlots_FilterBySpecialty() {

        LocalDate selectedDate = LocalDate.of(2025, 11, 23);

        when(professionalRepository.findIdsBySpecialtyId("TO"))
                .thenReturn(List.of("p1"));

        when(professionalRepository.findNameById("p1")).thenReturn("Ana");
        when(professionalRepository.findSpecialtyById("p1")).thenReturn("TO");

        when(professionalWorkdayRepository.findAvailableDays("p1"))
                .thenReturn(List.of("domingo"));

        when(professionalWorkdayRepository.findShiftsForDay("p1", "domingo"))
                .thenReturn(List.<Object[]>of(new Object[]{"08:00", "09:00"}));

        when(professionalWorkdayRepository.findBookedTimes("p1", selectedDate))
                .thenReturn(List.of());

        List<AvailableSlot> slots = service.getAllAvailableSlots(selectedDate, "TO", null);

        assertEquals(2, slots.size());
        assertEquals("TO", slots.get(0).specialtyId());
    }


    @Test
    void getAllAvailableSlots_OptionalProfessionalIdsOverridesEverything() {
        LocalDate selectedDate = LocalDate.now();

        when(professionalRepository.findNameById("A")).thenReturn("Prof A");
        when(professionalRepository.findSpecialtyById("A")).thenReturn("Fisio");

        when(professionalWorkdayRepository.findAvailableDays("A"))
                .thenReturn(List.of());

        List<AvailableSlot> slots = service.getAllAvailableSlots(
                selectedDate,
                "Fisio",
                List.of("A")
        );

        assertEquals(0, slots.size());
        verify(professionalRepository, never()).findIdsBySpecialtyId(any());
        verify(professionalRepository, never()).findAllIds();
    }

    @Test
    void getAllAvailableSlots_NoProfessionalsFound_ReturnsEmptyList() {
        LocalDate selectedDate = LocalDate.now();

        when(professionalRepository.findAllIds())
                .thenReturn(List.of());

        List<AvailableSlot> slots = service.getAllAvailableSlots(selectedDate, null, null);

        assertTrue(slots.isEmpty());
    }
}



