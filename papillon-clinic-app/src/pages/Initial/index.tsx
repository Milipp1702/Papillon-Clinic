import papillon_icon from '../../assets/papillon_icon.png';
import peca_vermelha from '../../assets/peca-vermelha.png';
import preca_amarela from '../../assets/peca-amarela.png';
import peca_verde from '../../assets/peca-verde.png';
import trail from '../../assets/trail.png';
import Link from '../../components/baseComponents/Link';
import * as S from './styles';

const Initial: React.FC = () => {
  return (
    <S.Container>
      <h1>Bem-Vindo!</h1>
      <img className="logo" src={papillon_icon} alt="Clinica Papillon" />
      <Link variant="button" variantButton="terciary" to="/login">
        Entrar
      </Link>
      <S.PuzzlePiecesConteiner>
        <img src={peca_vermelha} className="piece_red" alt="" aria-hidden />
        <img src={preca_amarela} className="piece_yellow" alt="" aria-hidden />
        <img src={peca_verde} className="piece_green" alt="" aria-hidden />
      </S.PuzzlePiecesConteiner>

      <img src={trail} alt="" className="trailTop" aria-hidden />
      <img src={trail} alt="" className="trailBottom" aria-hidden />
    </S.Container>
  );
};

export default Initial;
