package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.Specialty;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.SpecialtyDTO;
import br.edu.ifrs.canoas.papillon_clinic.repository.SpecialtyRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.SpecialtyService;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SpecialtyServiceTests {

    private void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }

    @Test
    void getById_ReturnsSpecialty_WhenExists() throws Exception {
        SpecialtyRepository repository = mock(SpecialtyRepository.class);

        SpecialtyService service = new SpecialtyService();
        inject(service, "repository", repository);

        Specialty specialty = new Specialty();
        specialty.setId("1");
        specialty.setName("Pediatria");

        when(repository.findById("1")).thenReturn(Optional.of(specialty));

        Optional<Specialty> result = service.getById("1");

        assertTrue(result.isPresent());
        assertEquals("Pediatria", result.get().getName());
    }

    @Test
    void getById_ReturnsEmpty_WhenNotExists() throws Exception {
        SpecialtyRepository repository = mock(SpecialtyRepository.class);

        SpecialtyService service = new SpecialtyService();
        inject(service, "repository", repository);

        when(repository.findById("999")).thenReturn(Optional.empty());

        Optional<Specialty> result = service.getById("999");

        assertTrue(result.isEmpty());
    }

    @Test
    void getListSpecialties_ReturnsMappedDTOs() throws Exception {
        SpecialtyRepository repository = mock(SpecialtyRepository.class);

        SpecialtyService service = new SpecialtyService();
        inject(service, "repository", repository);

        Specialty s1 = new Specialty();
        s1.setId("1");
        s1.setName("Pediatria");

        Specialty s2 = new Specialty();
        s2.setId("2");
        s2.setName("Fisioterapia");

        when(repository.findAll()).thenReturn(List.of(s1, s2));

        List<SpecialtyDTO> result = service.getListSpecialties();

        assertEquals(2, result.size());
        assertEquals("Pediatria", result.get(0).name());
        assertEquals("Fisioterapia", result.get(1).name());
    }
}

