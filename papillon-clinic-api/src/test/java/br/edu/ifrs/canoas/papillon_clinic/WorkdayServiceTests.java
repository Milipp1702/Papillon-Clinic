package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkDay;
import br.edu.ifrs.canoas.papillon_clinic.domain.workday.WorkdayWithShiftsDTO;
import br.edu.ifrs.canoas.papillon_clinic.repository.ShiftRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.WorkdayRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.WorkdayService;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class WorkdayServiceTests {

    private void inject(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void getById_ReturnsWorkday_WhenExists() throws Exception {
        WorkdayRepository workdayRepository = mock(WorkdayRepository.class);
        ShiftRepository shiftRepository = mock(ShiftRepository.class);

        WorkdayService service = new WorkdayService();
        inject(service, "workdayRepository", workdayRepository);
        inject(service, "shiftRepository", shiftRepository);

        WorkDay wd = new WorkDay();
        wd.setId("1");
        wd.setDay("Monday");

        when(workdayRepository.findById("1")).thenReturn(Optional.of(wd));

        Optional<WorkDay> result = service.getById("1");

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
        assertEquals("Monday", result.get().getDay());
    }

    @Test
    void getWorkdayById_Throws_WhenNotExists() throws Exception {
        WorkdayRepository workdayRepository = mock(WorkdayRepository.class);
        ShiftRepository shiftRepository = mock(ShiftRepository.class);

        WorkdayService service = new WorkdayService();
        inject(service, "workdayRepository", workdayRepository);
        inject(service, "shiftRepository", shiftRepository);

        when(workdayRepository.findById("999")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                service.getWorkdayById("999")
        );

        assertEquals("Workday not found", ex.getMessage());
    }

    @Test
    void getAllWorkdaysWithShifts_ReturnsCorrectDTOs() throws Exception {
        WorkdayRepository workdayRepository = mock(WorkdayRepository.class);
        ShiftRepository shiftRepository = mock(ShiftRepository.class);

        WorkdayService service = new WorkdayService();
        inject(service, "workdayRepository", workdayRepository);
        inject(service, "shiftRepository", shiftRepository);

        // Workdays
        WorkDay wd1 = new WorkDay();
        wd1.setId("1");
        wd1.setDay("Monday");

        WorkDay wd2 = new WorkDay();
        wd2.setId("2");
        wd2.setDay("Tuesday");

        when(workdayRepository.findAll()).thenReturn(List.of(wd1, wd2));

        // Shifts
        Shift s1 = new Shift("s1", "Morning", LocalTime.of(8, 0), LocalTime.of(12, 0));
        Shift s2 = new Shift("s2", "Afternoon", LocalTime.of(13, 0), LocalTime.of(17, 0));

        when(shiftRepository.findAll()).thenReturn(List.of(s1, s2));

        List<WorkdayWithShiftsDTO> result = service.getAllWorkdaysWithShifts();

        assertEquals(2, result.size());

        WorkdayWithShiftsDTO monday = result.get(0);
        WorkdayWithShiftsDTO tuesday = result.get(1);

        assertEquals("Monday", monday.name());
        assertEquals("Tuesday", tuesday.name());

        assertEquals(2, monday.shifts().size());
        assertEquals(2, tuesday.shifts().size());

        assertEquals("Morning", monday.shifts().get(0).shift());
        assertEquals("Afternoon", monday.shifts().get(1).shift());
    }
}

