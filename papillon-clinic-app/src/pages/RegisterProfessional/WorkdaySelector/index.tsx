import { useEffect, useState } from 'react';
import { useClinicApi } from '../../../services/api/useClinicApi';
import * as S from './styles';
import { WorkdayWithShiftsDTO } from '../../../services/dtos';

type WorkdaySelection = {
  workday_id: string;
  shift_id: string;
};

type Props = {
  selected: WorkdaySelection[];
  onChange: (updated: WorkdaySelection[]) => void;
};

const WorkdaySelector: React.FC<Props> = ({ selected, onChange }) => {
  const { getAllWorkdaysWithShifts } = useClinicApi();
  const [workdays, setWorkdays] = useState<WorkdayWithShiftsDTO[]>([]);

  const fetchWorkdays = async () => {
    try {
      const response = await getAllWorkdaysWithShifts();
      setWorkdays(response);
    } catch (error) {
      console.error('Erro ao buscar dias e turnos:', error);
    }
  };

  useEffect(() => {
    fetchWorkdays();
  }, []);

  const isDaySelected = (workday_id: string) =>
    selected.some((d) => d.workday_id === workday_id);

  const getSelectedShiftIds = (workday_id: string) =>
    selected.filter((d) => d.workday_id === workday_id).map((d) => d.shift_id);

  const toggleDay = (workday_id: string) => {
    const isSelected = selected.some((d) => d.workday_id === workday_id);

    if (isSelected) {
      const updated = selected.filter((d) => d.workday_id !== workday_id);
      onChange(updated);
    } else {
      const day = workdays.find((d) => d.id === workday_id);
      const turnoPadrao = day?.shifts.find(
        (s) => s.shift.toLowerCase() === 'manhã'
      );

      if (turnoPadrao) {
        onChange([...selected, { workday_id, shift_id: turnoPadrao.id }]);
      }
    }
  };

  const handleShiftChange = (workday_id: string, shift_id: string) => {
    const day = workdays.find((d) => d.id === workday_id);
    if (!day) return;

    const updated = selected.filter((d) => d.workday_id !== workday_id);

    if (shift_id === 'AMBOS') {
      const manha = day.shifts.find((s) => s.shift.toLowerCase() === 'manhã');
      const tarde = day.shifts.find((s) => s.shift.toLowerCase() === 'tarde');

      if (manha && tarde) {
        onChange([
          ...updated,
          { workday_id, shift_id: manha.id },
          { workday_id, shift_id: tarde.id },
        ]);
      }
    } else {
      onChange([...updated, { workday_id, shift_id }]);
    }
  };

  const isBothSelected = (day: WorkdayWithShiftsDTO) => {
    const selectedIds = getSelectedShiftIds(day.id);
    const manha = day.shifts.find((s) => s.shift.toLowerCase() === 'manhã')?.id;
    const tarde = day.shifts.find((s) => s.shift.toLowerCase() === 'tarde')?.id;

    return (
      selectedIds.includes(manha!) &&
      selectedIds.includes(tarde!) &&
      selectedIds.length === 2
    );
  };

  return (
    <S.WorkdayContainer>
      {workdays.map((day) => (
        <div key={day.id}>
          <S.DayHeader>
            <input
              type="checkbox"
              id={`day-${day.id}`}
              onChange={() => toggleDay(day.id)}
              checked={isDaySelected(day.id)}
            />
            <label htmlFor={`day-${day.id}`}>{day.name}</label>
          </S.DayHeader>

          {isDaySelected(day.id) && (
            <S.RadioGroup>
              {day.shifts.map((shift) => (
                <S.RadioLabel key={shift.id}>
                  <input
                    type="radio"
                    name={`shift-${day.id}`}
                    value={shift.id}
                    title={shift.shift}
                    checked={getSelectedShiftIds(day.id).includes(shift.id)}
                    onChange={(e) => handleShiftChange(day.id, e.target.value)}
                  />
                  {shift.shift}
                </S.RadioLabel>
              ))}

              <S.RadioLabel>
                <input
                  type="radio"
                  name={`shift-${day.id}`}
                  value="AMBOS"
                  title="Manhã e Tarde"
                  checked={isBothSelected(day)}
                  onChange={() => handleShiftChange(day.id, 'AMBOS')}
                />
                Ambos
              </S.RadioLabel>
            </S.RadioGroup>
          )}
        </div>
      ))}
    </S.WorkdayContainer>
  );
};

export default WorkdaySelector;
