package br.edu.ifrs.canoas.papillon_clinic.service;

import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableDate;
import br.edu.ifrs.canoas.papillon_clinic.domain.professional.AvailableSlot;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalRepository;
import br.edu.ifrs.canoas.papillon_clinic.repository.ProfessionalWorkdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class ProfessionalWorkdayService {
    @Autowired
    ProfessionalWorkdayRepository professionalWorkdayRepository;

    @Autowired
    ProfessionalRepository professionalRepository;

    private DayOfWeek mapDayNameToDayOfWeek(String dayName) {
        return switch (dayName.toLowerCase()) {
            case "segunda-feira" -> DayOfWeek.MONDAY;
            case "terça-feira" -> DayOfWeek.TUESDAY;
            case "quarta-feira" -> DayOfWeek.WEDNESDAY;
            case "quinta-feira" -> DayOfWeek.THURSDAY;
            case "sexta-feira" -> DayOfWeek.FRIDAY;
            case "sábado" -> DayOfWeek.SATURDAY;
            case "domingo" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Dia inválido: " + dayName);
        };
    }

    private List<LocalDate> findNextDatesForDay(String dayName, LocalDate today) {
        DayOfWeek targetDay = mapDayNameToDayOfWeek(dayName);
        LocalDate firstDay = today.withDayOfMonth(1);  // Primeiro dia do mês atual
        LocalDate lastDay = today.plusMonths(1).withDayOfMonth(today.plusMonths(1).lengthOfMonth()); // Último dia do próximo mês

        List<LocalDate> availableDates = new ArrayList<>();
        LocalDate currentDate = firstDay;

        while (!currentDate.isAfter(lastDay)) {
            if (currentDate.getDayOfWeek() == targetDay) {
                availableDates.add(currentDate);
            }
            currentDate = currentDate.plusDays(1);
        }

        return availableDates;
    }

    public List<AvailableDate> getAvailableDates(String professionalId) {
        List<String> availableDays = professionalWorkdayRepository.findAvailableDays(professionalId);
        LocalDate today = LocalDate.now();
        List<AvailableDate> availableDates = new ArrayList<>();

        for (String day : availableDays) {
            List<LocalDate> nextDates = findNextDatesForDay(day, today);
            for (LocalDate date : nextDates) {
                availableDates.add(new AvailableDate(date, day));
            }
        }

        availableDates.sort(Comparator.comparing(AvailableDate::date));

        System.out.println("Datas ordenadas antes do retorno: " + availableDates);
        return availableDates;
    }

    private List<LocalTime> generateAvailableTimes(LocalTime startTime, LocalTime endTime) {
        List<LocalTime> availableTimes = new ArrayList<>();
        LocalTime currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
            availableTimes.add(currentTime);
            currentTime = currentTime.plusMinutes(30);
        }

        return availableTimes;
    }

    public List<AvailableSlot> getAllAvailableSlots(LocalDate selectedDate, String specialtyFilter, List<String> optionalProfessionalIds) {
        List<AvailableSlot> allSlots = new ArrayList<>();

        List<String> professionalIds = (optionalProfessionalIds != null && !optionalProfessionalIds.isEmpty())
                ? optionalProfessionalIds
                : (specialtyFilter != null
                ? professionalRepository.findIdsBySpecialtyId(specialtyFilter)
                : professionalRepository.findAllIds());

        for (String professionalId : professionalIds) {
            String professionalName = professionalRepository.findNameById(professionalId);
            String specialtyId = professionalRepository.findSpecialtyById(professionalId);

            List<AvailableDate> availableDates = getAvailableDates(professionalId);
            List<String> bookedDates = professionalWorkdayRepository.findBookedAppointments(professionalId);

            for (AvailableDate availableDate : availableDates) {
                if (selectedDate != null && !availableDate.date().equals(selectedDate)) continue;
                if (bookedDates.contains(availableDate.date().toString())) continue;

                List<Object[]> shiftsForDay = professionalWorkdayRepository.findShiftsForDay(professionalId, availableDate.dayName());
                for (Object[] shift : shiftsForDay) {
                    LocalTime startTime = LocalTime.parse(shift[0].toString());
                    LocalTime endTime = LocalTime.parse(shift[1].toString());
                    List<LocalTime> times = generateAvailableTimes(startTime, endTime);

                    for (LocalTime time : times) {
                        allSlots.add(new AvailableSlot(availableDate.date(), time, professionalId, professionalName, specialtyId));
                    }
                }
            }
        }

        return allSlots;
    }
}
