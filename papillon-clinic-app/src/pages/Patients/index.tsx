import React, { useEffect, useState } from 'react';
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

const columns = [
  { field: 'name', headerName: 'Paciente' },
  { field: 'age', headerName: 'Idade' },
  { field: 'guardian', headerName: 'Responsável' },
];

const Patients: React.FC = () => {
  const [error, setError] = useState(false);
  const [patientList, setPatientList] = useState<any[] | null>(null);
  const { getPatients } = useClinicApi();

  const getPatientsData = async () => {
    try {
      const response = await getPatients();

      setPatientList(response.content);
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
        <PageTitle>Pacientes</PageTitle>

        <S.Options>
          <Link
            to={SCREEN_PATHS.registerPatient}
            variant="button"
            variantButton="terciary"
          >
            Novo Paciente
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
            Erro ao listar pacientes
          </span>
        )}
        {patientList && (
          <TableList
            columns={columns}
            rows={patientList}
            redirect={SCREEN_PATHS.patients}
          />
        )}
      </S.main>
    </PageWrapper>
  );
};

export default Patients;
