import React, { useState, useRef, useEffect } from 'react';
import * as S from './styles';
import { ProfessionalListDTO } from '../../../services/dtos';
import Button from '../../../components/baseComponents/Button';
import Spinner from '../../../components/baseComponents/Spinner';

type MultiSelectProps = {
  professionals: ProfessionalListDTO[];
  selectedIds: String[];
  toggleProfessional: (id: String) => void;
  getAppointments: (ids?: String[]) => void;
  loading?: boolean;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  professionals,
  selectedIds,
  toggleProfessional,
  getAppointments,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <S.MultiSelectContainer ref={dropdownRef}>
      <div>
        <h4>Filtrar por profissional:</h4>
        <S.Dropdown>
          <S.DropdownToggle onClick={() => setIsOpen(!isOpen)}>
            {selectedIds.length > 0
              ? `${selectedIds.length} selecionado(s)`
              : 'Selecionar profissionais'}
          </S.DropdownToggle>
          {isOpen && (
            <S.DropdownMenu>
              {professionals.map((prof) => (
                <S.DropdownItem key={prof.id}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(prof.id)}
                    onChange={() => toggleProfessional(prof.id)}
                  />
                  {prof.name}
                </S.DropdownItem>
              ))}
            </S.DropdownMenu>
          )}
        </S.Dropdown>
      </div>
      <div className="button-container">
        <Button
          className="button-search"
          type="button"
          variant="primary"
          onClick={() => getAppointments(selectedIds)}
        >
          {loading ? (
            <>
              <Spinner id="spinner" /> Buscando...
            </>
          ) : (
            'Buscar'
          )}
        </Button>
      </div>
    </S.MultiSelectContainer>
  );
};

export default MultiSelect;
