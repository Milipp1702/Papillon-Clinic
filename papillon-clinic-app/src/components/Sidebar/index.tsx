import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../baseComponents/Button';
import Icon from '../Icon';
import Link from '../baseComponents/Link';
import papillon_icon_small from '../../assets/papillon_icon_small.png';
import MenuHamburguer from '../MenuHamburguer';
import * as S from './styles';

const NAV_LINKS = [
  { path: '/home', name: 'Home', icon: 'home', isAdmin: false },
  { path: '/patients', name: 'Pacientes', icon: 'patient', isAdmin: false },
  {
    path: '/professionals',
    name: 'Profissionais',
    icon: 'professional',
    isAdmin: true,
  },
  {
    path: '/appointments',
    name: 'Atendimentos',
    icon: 'appointment',
    isAdmin: false,
  },
  { path: '/calendar', name: 'Agenda', icon: 'calendar', isAdmin: false },
  {
    path: '/financial-report',
    name: 'Relatórios Financeiros',
    icon: 'finance',
    isAdmin: true,
  },
];

type Props = {
  isOpen: boolean;
  handleMenu: () => void;
};

const SideBar: React.FC<Props> = ({ isOpen, handleMenu }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const canAccess = (isAdminItem: boolean, role: string) => {
    if (role === 'ADMIN') return true;
    return !isAdminItem;
  };

  return (
    <S.Nav $isOpen={isOpen}>
      <div>
        <S.NavHeader>
          <img
            className="logo"
            src={papillon_icon_small}
            alt="Clinica Papillon"
          />

          <MenuHamburguer
            isOpen={isOpen}
            onClick={handleMenu}
            className="button-hamburguer"
          />
        </S.NavHeader>
        <S.List>
          {NAV_LINKS.filter((item) =>
            canAccess(item.isAdmin, user?.role || 'USER')
          ).map((item, index) => (
            <S.ListItem key={index + '-menu-item'}>
              <Link to={item.path}>
                <Icon size={24} icon={item.icon} />
                <span>{item.name}</span>
              </Link>
            </S.ListItem>
          ))}
        </S.List>
      </div>
      <S.NavFooter $isOpen={isOpen}>
        <S.User>
          <S.Avatar aria-hidden>{user?.user[0].toUpperCase()}</S.Avatar>
          <S.Credentials>
            <span
              className="credentials-usermane"
              aria-label={user?.user}
              title={user?.user}
            >
              {user?.user}
            </span>
            <span>
              {user?.role === 'ADMIN' ? 'Administrador' : 'Profissional'}
            </span>
          </S.Credentials>
        </S.User>
        <Button
          type="button"
          height={40}
          width={40}
          variant="iconButton"
          onClick={handleLogout}
          disabled={!open}
        >
          <Icon size={24} icon={'logout'} />
        </Button>
      </S.NavFooter>
    </S.Nav>
  );
};

export default SideBar;
