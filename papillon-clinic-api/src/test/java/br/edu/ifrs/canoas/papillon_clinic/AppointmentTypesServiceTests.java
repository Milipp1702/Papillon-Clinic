package br.edu.ifrs.canoas.papillon_clinic;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypeDTO;
import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.AppointmentTypes;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentTypeMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentTypesRepository;
import br.edu.ifrs.canoas.papillon_clinic.service.AppointmentTypesService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentTypesServiceTests {

    @InjectMocks
    private AppointmentTypesService service;

    @Mock
    private AppointmentTypesRepository repository;

    private MockedStatic<AppointmentTypeMapper> mockedMapper;

    @BeforeEach
    void setup() {
        mockedMapper = Mockito.mockStatic(AppointmentTypeMapper.class);
    }

    @AfterEach
    void tearDown() {
        mockedMapper.close();
    }

    @Test
    void getById_ReturnsOptional_WhenExists() {
        AppointmentTypes type = new AppointmentTypes();
        type.setId("1");
        type.setName("Consulta");

        when(repository.findById("1")).thenReturn(Optional.of(type));

        Optional<AppointmentTypes> result = service.getById("1");

        assertTrue(result.isPresent());
        assertEquals("Consulta", result.get().getName());
    }

    @Test
    void getById_ReturnsEmpty_WhenNotExists() {
        when(repository.findById("x")).thenReturn(Optional.empty());

        Optional<AppointmentTypes> result = service.getById("x");

        assertTrue(result.isEmpty());
    }

    @Test
    void getListTypes_ReturnsMappedList() {
        AppointmentTypes type1 = new AppointmentTypes();
        type1.setId("1");
        type1.setName("Consulta");

        AppointmentTypes type2 = new AppointmentTypes();
        type2.setId("2");
        type2.setName("Terapia");

        when(repository.findAll()).thenReturn(List.of(type1, type2));

        AppointmentTypeDTO dto1 = new AppointmentTypeDTO("1", "Consulta", 190);
        AppointmentTypeDTO dto2 = new AppointmentTypeDTO("2", "Terapia", 160);
        mockedMapper.when(() -> AppointmentTypeMapper.fromEntityToDto(type1)).thenReturn(dto1);
        mockedMapper.when(() -> AppointmentTypeMapper.fromEntityToDto(type2)).thenReturn(dto2);

        List<AppointmentTypeDTO> result = service.getListTypes();

        assertEquals(2, result.size());
        assertEquals("Consulta", result.get(0).name());
        assertEquals("Terapia", result.get(1).name());
    }
}

