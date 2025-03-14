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

const columns = [
  { field: 'name', headerName: 'Profissional' },
  { field: 'cpf', headerName: 'CPF' },
  { field: 'crm', headerName: 'CRM' },
];

const Professionals: React.FC = () => {
  const [error, setError] = useState(false);
  const [professionalList, setprofessionalList] = useState<any[] | null>(null);
  const { getProfessionals } = useClinicApi();

  const getPatientsData = async () => {
    try {
      const response = await getProfessionals();

      setprofessionalList(response.content);
    } catch (error) {
      console.log('error' + error);
      setError(true);
    }
  };

  useEffect(() => {
    getPatientsData();
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
            <Input id="search" placeholder="Buscar..." />
            <Button variant="iconButton" aria-label="Buscar">
              <Icon icon="search" size={22} />
            </Button>
          </S.InputContainer>
        </S.Options>
        {error && (
          <span style={{ color: 'red' }} role="alert">
            Erro ao listar profissionais
          </span>
        )}
        {professionalList && (
          <TableList
            columns={columns}
            rows={professionalList}
            redirect={SCREEN_PATHS.professionals}
          />
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Professionals;
