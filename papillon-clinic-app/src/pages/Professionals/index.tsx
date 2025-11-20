import { useState, useEffect } from 'react';
import { useClinicApi } from '../../services/api/useClinicApi';
import PageWrapper from '../../components/PageWrapper';
import PageTitle from '../../components/baseComponents/PageTitle';
import Link from '../../components/baseComponents/Link';
import { SCREEN_PATHS } from '../../constants/paths';
import Input from '../../components/baseComponents/Input';
import Button from '../../components/baseComponents/Button';
import Icon from '../../components/Icon';
import TableList from '../../components/TableList';
import * as S from './styles';
import ConfirmationModal from '../../components/ConfirmationModal';

const columns = [
  { field: 'name', headerName: 'Profissional' },
  { field: 'cpf', headerName: 'CPF' },
  { field: 'specialty', headerName: 'Especialidade' },
];

const Professionals: React.FC = () => {
  const [error, setError] = useState(false);
  const [professionalList, setProfessionalList] = useState<any[] | null>(null);
  const { getProfessionals, deleteProfessional, searchProfessionals } =
    useClinicApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProfessional(selectedId);

      setShowModal(false);
      await getProfessionalsData();
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
    }
  };

  const getProfessionalsData = async () => {
    try {
      const response = await getProfessionals(page);
      console.log(response);
      setProfessionalList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchProfessionals(searchTerm, page);
      console.log(response);
      setProfessionalList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  useEffect(() => {
    getProfessionalsData();
  }, []);

  return (
    <PageWrapper>
      <S.main>
        <PageTitle>Profissionais</PageTitle>
        <S.Options>
          <Link
            to={SCREEN_PATHS.registerProfessional}
            variant="button"
            variantButton="terciary"
          >
            Novo Profissional
          </Link>
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
              id="button-search"
              onClick={handleSearch}
            >
              <Icon icon="search" size={22} />
            </Button>
          </S.InputContainer>
        </S.Options>
        {error && (
          <S.ErrorMessage role="alert">
            <Icon size={70} icon="error" primaryColor="red" />
            <p>Erro ao listar profissionais!</p>
          </S.ErrorMessage>
        )}
        {professionalList && (
          <>
            <S.TableContainer>
              <TableList
                columns={columns}
                rows={professionalList}
                redirect={SCREEN_PATHS.professionals}
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
            message="Tem certeza que deseja excluir este profissional?"
            onCancel={() => setShowModal(false)}
            isOpen={showModal}
          />
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Professionals;
