import React, { useContext, useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper';
import PageTitle from '../../components/baseComponents/PageTitle';
import { SCREEN_PATHS } from '../../constants/paths';
import Link from '../../components/baseComponents/Link';
import Input from '../../components/baseComponents/Input';
import Icon from '../../components/Icon';
import Button from '../../components/baseComponents/Button';
import TableList from '../../components/TableList';
import { useClinicApi } from '../../services/api/useClinicApi';
import * as S from './styles';
import { AuthContext } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const columns = [
  { field: 'name', headerName: 'Paciente' },
  { field: 'age', headerName: 'Idade' },
  { field: 'guardian', headerName: 'Responsável' },
];

const Patients: React.FC = () => {
  const [error, setError] = useState(false);
  const [patientList, setPatientList] = useState<any[] | null>(null);
  const { getPatients, deletePatient } = useClinicApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[] | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePatient(selectedId);

      setShowModal(false);
      await getPatientsData();
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
    }
  };

  const getPatientsData = async () => {
    try {
      const response = await getPatients(page);
      setPatientList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  const handleSearch = () => {
    if (!patientList) return;

    const term = searchTerm.toLowerCase();
    const filtered = patientList.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(term) ||
        patient.guardian?.toLowerCase().includes(term) ||
        String(patient.age).includes(term)
      );
    });

    setFilteredPatients(filtered);
  };

  useEffect(() => {
    getPatientsData();
  }, [page]);

  return (
    <PageWrapper>
      <S.main>
        <PageTitle>Pacientes</PageTitle>
        <S.Options>
          {user?.role === 'ADMIN' && (
            <Link
              to={SCREEN_PATHS.registerPatient}
              variant="button"
              variantButton="terciary"
              id="new-patient-button"
            >
              Novo Paciente
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
            <p>Erro ao listar pacientes!</p>
          </S.ErrorMessage>
        )}
        {patientList && (
          <>
            <S.TableContainer>
              <TableList
                columns={columns}
                rows={filteredPatients ?? patientList}
                redirect={SCREEN_PATHS.patients}
                withoutAccessBtn={user?.role !== 'ADMIN'}
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
            onConfirm={confirmDelete}
            message="Tem certeza que deseja excluir este paciente?"
            onCancel={() => setShowModal(false)}
            isOpen={showModal}
          />
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Patients;
