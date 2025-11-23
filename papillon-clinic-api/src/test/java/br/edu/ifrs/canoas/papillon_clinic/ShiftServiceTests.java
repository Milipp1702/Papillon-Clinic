package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.shift.Shift;
import br.edu.ifrs.canoas.papillon_clinic.repository.ShiftRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.ShiftService;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ShiftServiceTests {
    private void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }

    @Test
    void getById_ReturnsShift_WhenExists() throws Exception {
        ShiftRepository repository = mock(ShiftRepository.class);

        ShiftService service = new ShiftService();
        inject(service, "shiftRepository", repository);

        Shift shift = new Shift();
        shift.setId("1");

        when(repository.findById("1")).thenReturn(Optional.of(shift));

        Optional<Shift> result = service.getById("1");

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
    }

    @Test
    void getById_ReturnsEmpty_WhenNotExists() throws Exception {
        ShiftRepository repository = mock(ShiftRepository.class);

        ShiftService service = new ShiftService();
        inject(service, "shiftRepository", repository);

        when(repository.findById("999")).thenReturn(Optional.empty());

        Optional<Shift> result = service.getById("999");

        assertTrue(result.isEmpty());
    }

    @Test
    void getShiftById_ReturnsShift_WhenExists() throws Exception {
        ShiftRepository repository = mock(ShiftRepository.class);

        ShiftService service = new ShiftService();
        inject(service, "shiftRepository", repository);

        Shift shift = new Shift();
        shift.setId("10");

        when(repository.findById("10")).thenReturn(Optional.of(shift));

        Shift result = service.getShiftById("10");

        assertNotNull(result);
        assertEquals("10", result.getId());
    }

    @Test
    void getShiftById_ThrowsException_WhenNotExists() throws Exception {
        ShiftRepository repository = mock(ShiftRepository.class);

        ShiftService service = new ShiftService();
        inject(service, "shiftRepository", repository);

        when(repository.findById("777")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            service.getShiftById("777");
        });

        assertEquals("Shift not found", ex.getMessage());
    }
}

