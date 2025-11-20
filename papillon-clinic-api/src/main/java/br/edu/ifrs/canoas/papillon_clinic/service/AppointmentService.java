package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.appointment.*;
import br.edu.ifrs.canoas.papillon_clinic.domain.patient.Patient;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.*;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentFrequencyMapper;
import br.edu.ifrs.canoas.papillon_clinic.mapper.AppointmentMapper;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentFrequencyRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.AppointmentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    AppointmentRepository repository;

    @Autowired
    PatientService patientService;

    @Autowired
    ProfessionalService professionalService;

    @Autowired
    AppointmentTypesService appointmentTypesService;

    @Autowired
    AppointmentFrequencyRepository appointmentFrequencyRepository;

    @Autowired
    ProfessionalWorkdayService professionalWorkdayService;

    @PersistenceContext
    private EntityManager entityManager;


    public Optional<Appointment> getById(String id){
        return repository.findById(id);
    }

    public AppointmentDetailsDTO findById(String id) throws Exception {
        Optional<Appointment> appointment = this.getById(id);
        if(appointment.isEmpty()){
            throw new Exception();
        }
        Optional<Professional> professional = professionalService.getById(appointment.get().getProfessional().getId());
        String specialtyId = "";
        String professionalName = "";
        if(professional.isPresent()){
            specialtyId = professional.get().getSpecialty().getId();
            professionalName = professional.get().getName();
        }


        return AppointmentMapper.fromEntityToDtoDetailed(appointment.get(),specialtyId, professionalName);
    }

    public List<LocalDateTime> generateDatesFromFrequency(AppointmentFrequency frequency, LocalDateTime startDate) {
        List<LocalDateTime> dates = new ArrayList<>();
        LocalDateTime current = startDate;

        LocalDate endDate = frequency.getEnd_date();
        ChronoUnit unit = switch (frequency.getFrequency()) {
            case DIARIA -> ChronoUnit.DAYS;
            case SEMANAL -> ChronoUnit.WEEKS;
            case MENSAL  -> ChronoUnit.MONTHS;
            case ANUAL   -> ChronoUnit.YEARS;
            default -> throw new IllegalArgumentException("Frequência inválida: " + frequency.getFrequency());
        };

        current = current.plus(frequency.getFrequency_interval(), unit);
        while (!current.toLocalDate().isAfter(endDate)) {
            dates.add(current);
            current = current.plus(frequency.getFrequency_interval(), unit);
        }

        return dates;
    }

    public List<LocalDateTime> generateAppointmentsFromFrequency(
            AppointmentFrequency frequency,
            AppointmentDTO appointmentDto,
            Professional professional
    ) throws Exception {
        List<LocalDateTime> generatedDateTimes = generateDatesFromFrequency(frequency, appointmentDto.appointment_date());
        List<LocalDateTime> skippedDateTimes = new ArrayList<>();

        for (LocalDateTime dateTime : generatedDateTimes) {
            List<AvailableSlot> slots = professionalWorkdayService.getAllAvailableSlots(
                    dateTime.toLocalDate(),
                    professional.getSpecialty().getId(),
                    List.of(professional.getId())
            );
            Optional<AvailableSlot> maybeSlot = slots.stream()
                    .filter(slot -> slot.time().equals(dateTime.toLocalTime()))
                    .findFirst();

            if (maybeSlot.isEmpty()) {
                skippedDateTimes.add(dateTime);
                continue;
            }

            AppointmentDTO futureDto = new AppointmentDTO(
                    null,
                    dateTime,
                    appointmentDto.payment_type(),
                    null,
                    appointmentDto.observation(),
                    appointmentDto.professionalId(),
                    appointmentDto.patientId(),
                    appointmentDto.appointmentTypeId(),
                    appointmentDto.frequency()
            );

            Appointment futureAppointment = AppointmentMapper.fromDtoToEntity(
                    futureDto,
                    appointmentTypesService.getById(futureDto.appointmentTypeId()).get(),
                    patientService.getById(futureDto.patientId()).get(),
                    professional,
                    frequency
            );

            try {
                repository.save(futureAppointment);
            } catch (Exception e) {
                skippedDateTimes.add(dateTime);
            }
        }

        return skippedDateTimes;
    }

    public List<LocalDateTime> registerAppointment(AppointmentDTO appointmentDto) throws Exception {
        Patient patient = patientService.getById(appointmentDto.patientId())
                .orElseThrow(() -> new Exception("Patient not Found"));

        Professional professional = professionalService.getById(appointmentDto.professionalId())
                .orElseThrow(() -> new Exception("Professional not Found"));

        AppointmentTypes appointmentType = appointmentTypesService.getById(appointmentDto.appointmentTypeId())
                .orElseThrow(() -> new Exception("Appointment type not Found"));

        List<AvailableSlot> availableSlots = professionalWorkdayService.getAllAvailableSlots(
                appointmentDto.appointment_date().toLocalDate(),
                professional.getSpecialty().getId(),
                List.of(professional.getId())
        );

        boolean isAvailable = availableSlots.stream()
                .anyMatch(slot -> slot.time().equals(appointmentDto.appointment_date().toLocalTime()));

        if (!isAvailable) {
            throw new Exception("Horário indisponível para o profissional selecionado!");
        }

        AppointmentFrequency frequency = null;
        if (appointmentDto.frequency() != null) {
            frequency = AppointmentFrequencyMapper.fromDtoToEntity(appointmentDto.frequency());
            if (frequency.getId() == null || !appointmentFrequencyRepository.existsById(frequency.getId())) {
                appointmentFrequencyRepository.save(frequency);
            }
        }

        Appointment mainAppointment = AppointmentMapper.fromDtoToEntity(
                appointmentDto, appointmentType, patient, professional, frequency
        );
        repository.save(mainAppointment);

        return (frequency == null)
                ? List.of()
                : generateAppointmentsFromFrequency(frequency, appointmentDto, professional);
    }

    private AppointmentFrequency handleFrequencyUpdate(AppointmentDTO dto, Appointment existing) {
        AppointmentFrequency frequency = null;
        if (dto.frequency() != null) {
            frequency = updateOrCreateFrequency(dto.frequency());

            existing.assignFrequency(frequency);
            repository.save(existing);
        } else if (existing.getFrequency() != null) {
            AppointmentFrequency oldFreq = existing.getFrequency();
            existing.assignFrequency(null);
            repository.save(existing);

            List<Appointment> futureAppointments = repository
                    .findByFrequency_IdAndAppointmentDateAfter(oldFreq.getId(), LocalDateTime.now());

            repository.deleteAll(futureAppointments);
            appointmentFrequencyRepository.delete(oldFreq);
        }
        return frequency;
    }

    private void updateFrequencyFields(AppointmentFrequency freq, AppointmentFrequencyDTO dto) {
        freq.setEnd_date(dto.end_date());
        freq.setFrequency_interval(dto.frequency_interval());
        freq.setEmailReminder(dto.emailReminder());
        freq.setFrequency(dto.frequency());
    }

    private AppointmentFrequency updateOrCreateFrequency(AppointmentFrequencyDTO dto) {
        System.out.println(dto.id());
        if (dto.id() == null) {
            return appointmentFrequencyRepository.save(AppointmentFrequencyMapper.fromDtoToEntity(dto));
        }

        Optional<AppointmentFrequency> optionalExisting = appointmentFrequencyRepository.findById(dto.id());

        if (optionalExisting.isEmpty()) {
            throw new IllegalArgumentException("Frequência com ID " + dto.id() + " não encontrada");
        }

        AppointmentFrequency existing = optionalExisting.get();
        if (!hasFrequencyChanged(existing, dto)) {
            return existing;
        }

        updateFrequencyFields(existing, dto);
        return appointmentFrequencyRepository.save(existing);
    }

    private List<LocalDateTime> regenerateAppointments(AppointmentFrequency frequency, AppointmentDTO dto, Professional professional) throws Exception {
        List<Appointment> futureAppointments = repository
                .findByFrequency_IdAndAppointmentDateAfter(frequency.getId(), LocalDateTime.now());

        List<Appointment> toDelete = futureAppointments.stream()
                .filter(a -> !a.getAppointmentDate().isEqual(dto.appointment_date()))
                .toList();

        repository.deleteAll(toDelete);

        return generateAppointmentsFromFrequency(frequency, dto, professional);
    }

    private void updateAppointmentFields(Appointment existing, AppointmentDTO dto, Professional professional, Patient patient, AppointmentTypes type, AppointmentFrequency frequency) {
        existing.setAppointmentDate(dto.appointment_date());
        existing.setPayment_type(dto.payment_type());
        existing.setPayment_date(dto.payment_date());
        existing.setPatient(patient);
        existing.setProfessional(professional);
        existing.setAppointmentTypes(type);
        existing.setObservation(dto.observation());
        existing.assignFrequency(frequency);
    }

    private boolean hasFrequencyChanged(AppointmentFrequency oldFreq, AppointmentFrequencyDTO dto) {
        if (oldFreq == null && dto != null) return true;
        if (oldFreq != null && dto == null) return true;
        if (oldFreq == null) return false;
        return !Objects.equals(oldFreq.getEnd_date(), dto.end_date())
                || !Objects.equals(oldFreq.getFrequency_interval(), dto.frequency_interval())
                || !Objects.equals(oldFreq.getFrequency(), dto.frequency())
                || oldFreq.isEmailReminder() != dto.emailReminder();
    }

    public List<LocalDateTime> updateAppointment(AppointmentDTO dto) throws Exception {
        Appointment existing = repository.findById(dto.id())
                .orElseThrow(() -> new Exception("Appointment not found"));

        Professional professional = professionalService.getById(dto.professionalId())
                .orElseThrow(() -> new Exception("Professional not found"));

        Patient patient = patientService.getById(dto.patientId())
                .orElseThrow(() -> new Exception("Patient not found"));

        AppointmentTypes type = appointmentTypesService.getById(dto.appointmentTypeId())
                .orElseThrow(() -> new Exception("Appointment type not found"));

        AppointmentFrequency previousFrequency = existing.getFrequency();
        AppointmentFrequency updatedFrequency = handleFrequencyUpdate(dto, existing);

        updateAppointmentFields(existing, dto, professional, patient, type, updatedFrequency);

        boolean frequencyChanged = hasFrequencyChanged(previousFrequency, dto.frequency());
        List<LocalDateTime> skippedDateTimes = List.of();
        System.out.println((previousFrequency));
        System.out.println((dto.frequency()));
        System.out.println("---------------"+updatedFrequency);
        if (frequencyChanged && updatedFrequency != null) {
            skippedDateTimes = regenerateAppointments(updatedFrequency, dto, professional);
        }

        repository.save(existing);
        return skippedDateTimes;
    }

    public Page<AppointmentResponseDTO> getListAppointments(Pageable pagination){
        return repository.findAll(pagination).map(AppointmentMapper::fromEntityToDtoResponse);

    public List<AppointmentFinancialDTO> getAppointmentFinancials(String patientId, String professionalId) {
        List<Object[]> results = entityManager.createNativeQuery("""
                            SELECT 
                                a.appointment_date,
                                p.name,                                             
                                pr.name,
                                at.name,
                                s.name,
                                at.amount,
                                CASE WHEN a.payment_date IS NOT NULL THEN true ELSE false END AS isPaid,
                                pr.discount
                            FROM appointments a
                            JOIN patients p ON a.patient_id = p.id
                            JOIN professionals pr ON a.professional_id = pr.id
                            JOIN specialties s ON pr.specialty_id = s.id
                            JOIN appointment_types at ON a.appointment_type = at.id
                            WHERE (:patientId IS NULL OR a.patient_id = :patientId)
                              AND (:professionalId IS NULL OR a.professional_id = :professionalId)
                              AND MONTH(a.appointment_date) = MONTH(CURRENT_DATE)
                              AND YEAR(a.appointment_date) = YEAR(CURRENT_DATE)
                        """)
                .setParameter("patientId", patientId)
                .setParameter("professionalId", professionalId)
                .getResultList();


        return results.stream()
                .map(r -> {
                    BigDecimal amount = (BigDecimal) r[5];
                    BigDecimal discount = (BigDecimal) r[7];
                    BigDecimal netAmount = amount.multiply(BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100))));
                    return new AppointmentFinancialDTO(
                        ((Timestamp) r[0]).toLocalDateTime(),
                        (String) r[1],
                        (String) r[2],
                        (String) r[3],
                        (String) r[4],
                        (BigDecimal) r[5],
                        (Long) r[6],
                            netAmount
                );})
                .toList();
    }

    public List<AppointmentResponseDTO> getAppointmentsForCalendar(List<String> professionalIds) {
        List<Appointment> appointments;

        if (professionalIds == null || professionalIds.isEmpty()) {
            appointments = repository.findAll();
        } else {
            appointments = repository.findByProfessional_IdIn(professionalIds);
        }

        return appointments.stream()
                .map(AppointmentMapper::fromEntityToDtoResponse)
                .collect(Collectors.toList());
    }

    public long getQuantityAppointments(){
        return repository.findByAppointmentDateBetween(LocalDate.now().with(TemporalAdjusters.firstDayOfMonth()),LocalDate.now()).size();
    }
}
