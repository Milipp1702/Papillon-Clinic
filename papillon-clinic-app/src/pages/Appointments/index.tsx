import React, { useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper';
import PageTitle from '../../components/baseComponents/PageTitle';
import { SCREEN_PATHS } from '../../constants/paths';
import Input from '../../components/baseComponents/Input';
import Icon from '../../components/Icon';
import Button from '../../components/baseComponents/Button';
import Link from '../../components/baseComponents/Link';
import TableList from '../../components/TableList';
import { useClinicApi } from '../../services/api/useClinicApi';
import * as S from './styles';

const columns = [
  {
    field: 'appointmentDate',
    headerName: 'Data',
    renderCell: (value: string) => {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  { field: 'patientName', headerName: 'Paciente' },
  { field: 'professionalName', headerName: 'Profissional' },
  { field: 'typeName', headerName: 'Tipo de Atendimento' },
  {
    field: 'isPaid',
    headerName: 'Status Pagamento',
    renderCell: (value: boolean) => (value ? 'Pago' : 'Não Pago'),
  },
];

const Appointments: React.FC = () => {
  const [error, setError] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<any[] | null>(null);
  const { getAppointments } = useClinicApi();

  const getAppointmentsData = async () => {
    try {
      const response = await getAppointments();
      setAppointmentsList(response.content);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <PageWrapper>
      <S.main>
        <PageTitle>Atendimentos</PageTitle>
        <S.Options>
          <Link
            to={SCREEN_PATHS.registerAppointment}
            variant="button"
            variantButton="terciary"
            className="new-appointment-button"
          >
            Novo Atendimento
          </Link>
          <S.InputContainer>
            <Input id="search" placeholder="Buscar..." />
            <Button variant="iconButton" aria-label="Buscar">
              <Icon icon="search" size={22} />
            </Button>
          </S.InputContainer>
        </S.Options>
        {error && (
          <span style={{ color: 'red' }} role="alert">
            Erro ao listar atendimentos
          </span>
        )}
        {appointmentsList && (
          <S.TableContainer>
            <TableList
              columns={columns}
              rows={appointmentsList}
              redirect={SCREEN_PATHS.appointments}
            />
          </S.TableContainer>
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Appointments;
