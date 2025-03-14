import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import papillon_icon from '../../assets/papillon_icon.png';
import { useClinicApi } from '../../services/api/useClinicApi';
import { ProfessionalListDTO } from '../../services/dtos';
import * as S from './styles';

const Home: React.FC = () => {
  const [ranking, setRanking] = useState<ProfessionalListDTO[] | null>(null);
  const [numberOfPatients, setNumberOfPatients] = useState<number>(0);
  const [numberOfAppointments, setNumberOfAppointments] = useState<number>(0);
  const [numberOfProfessionals, setNumberOfProfessionals] = useState<number>(0);

  const {
    getTopSixProfessionals,
    getNumberOfPatients,
    getNumberOfAppointments,
    getNumberOfProfessionals,
  } = useClinicApi();

  const getRanking = async () => {
    try {
      const response = await getTopSixProfessionals();

      setRanking(response);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const getQuantityPatients = async () => {
    try {
      const response = await getNumberOfPatients();
      setNumberOfPatients(response);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const getQuantityAppointments = async () => {
    try {
      const response = await getNumberOfAppointments();
      setNumberOfAppointments(response);
    } catch (error) {
      console.log('error' + error);
    }
  };
  const getQuantityProfessionals = async () => {
    try {
      const response = await getNumberOfProfessionals();
      setNumberOfProfessionals(response);
    } catch (error) {
      console.log('error' + error);
    }
  };

  useEffect(() => {
    getRanking();
    getQuantityPatients();
    getQuantityAppointments();
    getQuantityProfessionals();
  }, []);
  return (
    <PageWrapper>
      <S.Header>
        <img className="logo" src={papillon_icon} alt="Clinica Papillon" />
      </S.Header>
      <S.Main>
        <S.Display>
          <S.RankingList>
            <h2>Ranking de Profissionais</h2>
            <div>
              {ranking &&
                ranking.map((item, index) => {
                  const variant = index % 2 === 0 ? '' : 'grey';

                  return (
                    <S.RankingListItem key={item.id} className={variant}>
                      <span>{index + 1}º</span>
                      {item.name}
                    </S.RankingListItem>
                  );
                })}
            </div>
          </S.RankingList>
          <S.QuantityCardContainer>
            <S.QuantityCard>
              {<span>{numberOfPatients}</span>}
              Pacientes
            </S.QuantityCard>
            <S.QuantityCard>
              {<span>{numberOfAppointments}</span>}
              Atendimentos
            </S.QuantityCard>
            <S.QuantityCard>
              {<span>{numberOfProfessionals}</span>}
              Profissionais
            </S.QuantityCard>
          </S.QuantityCardContainer>
        </S.Display>
      </S.Main>
    </PageWrapper>
  );
};

export default Home;
