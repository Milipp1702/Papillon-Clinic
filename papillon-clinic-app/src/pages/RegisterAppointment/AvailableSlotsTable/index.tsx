import { AvailableSlotsDTO } from '../../../services/dtos';
import * as S from './styles';

type props = {
  slots: AvailableSlotsDTO[];
  onSelectSlot: (slot: AvailableSlotsDTO) => void;
};

const AvailableSlotsTable: React.FC<props> = ({ slots, onSelectSlot }) => {
  const formatDate = (value: string) => {
    const parts = value.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  };

  return (
    <S.AvailableSlotsTable>
      <thead>
        <tr>
          <th>
            <span>Data</span>
          </th>
          <th>
            <span>Horário</span>
          </th>
          <th>
            <span>Profissional</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {slots &&
          slots.map((slot, index) => {
            const variant = index % 2 === 0 ? '' : 'grey';

            return (
              <tr
                className={variant}
                key={'slot-' + index + slot.date + slot.time}
              >
                <td>{formatDate(slot.date)}</td>
                <td>{slot.time}</td>
                <td>{slot.professionalName}</td>
                <td>
                  <button type="button" onClick={() => onSelectSlot(slot)}>
                    Selecionar
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </S.AvailableSlotsTable>
  );
};

export default AvailableSlotsTable;
