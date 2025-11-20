import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

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
  const {
    getAppointments,
    getAppointmentsForProfessional,
    deleteAppointment,
    searchAppointments,
  } = useClinicApi();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async (deleteAll: boolean) => {
    try {
      await deleteAppointment(selectedId, deleteAll);

      setShowModal(false);
      await getAppointmentsData();
    } catch (error) {
      console.error('Erro ao deletar atendimento:', error);
    }
  };

  const getAppointmentsData = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const response = await getAppointments(page);
        setAppointmentsList(response.content);
        setTotalPages(response.totalPages);
      } else {
        const userId = user?.id;
        if (userId) {
          getAppointmentsForProfessional(userId, page).then((response) => {
            setAppointmentsList(response.content);
            setTotalPages(response.totalPages);
          });
        }
      }
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchAppointments(searchTerm, page);
      console.log(response);
      setAppointmentsList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, [page]);

  return (
    <PageWrapper>
      <S.main>
        <PageTitle>Atendimentos</PageTitle>
        <S.Options>
          {user?.role === 'ADMIN' && (
            <Link
              to={SCREEN_PATHS.registerAppointment}
              variant="button"
              variantButton="terciary"
              className="new-appointment-button"
            >
              Novo Atendimento
            </Link>
          )}
          <S.InputContainer>
            <Input
              id="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="iconButton"
              aria-label="Buscar"
              onClick={handleSearch}
            >
              <Icon icon="search" size={22} />
            </Button>
          </S.InputContainer>
        </S.Options>
        {error && (
          <S.ErrorMessage role="alert">
            <Icon size={70} icon="error" primaryColor="red" />
            <p>Erro ao listar atendimentos!</p>
          </S.ErrorMessage>
        )}
        {appointmentsList && (
          <>
            <S.TableContainer>
              <TableList
                columns={columns}
                rows={appointmentsList}
                redirect={SCREEN_PATHS.appointments}
                withoutDeleteButton={user?.role !== 'ADMIN'}
                onDeleteRequest={openDeleteModal}
              />
            </S.TableContainer>
            {totalPages > 1 && (
              <S.Pagination>
                <Button onClick={() => setPage(0)} disabled={page === 0}>
                  <Icon icon="chevronsLeft" size={40} />
                </Button>
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  <Icon icon="chevronLeft" size={40} />
                </Button>
                <span>
                  Página {page + 1} de {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page + 1 >= totalPages}
                >
                  <Icon icon="chevronRight" size={40} />
                </Button>
                <Button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page + 1 >= totalPages}
                >
                  <Icon icon="chevronsRight" size={40} />
                </Button>
              </S.Pagination>
            )}
          </>
        )}
        {showModal && (
          <ConfirmationModal
            title="Confirmar exclusão"
            onConfirm={() => confirmDelete(false)}
            message="Deseja deletar somente o atendimento selecionado ou todos os atendimentos da frequência dele?"
            onCancel={() => setShowModal(false)}
            isOpen={showModal}
            isAppointment
            onConfirmAll={() => confirmDelete(true)}
          />
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Appointments;
