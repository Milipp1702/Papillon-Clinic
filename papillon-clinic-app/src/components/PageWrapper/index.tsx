import { ReactNode } from 'react';
import SideBar from '../Sidebar';
import { usePersistedState } from '../../utils/usePersistedState';
import * as S from './styles';

type Props = {
  children: ReactNode;
};

const PageWrapper: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = usePersistedState<boolean>('sidebarOpened', false);

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <SideBar isOpen={open} handleMenu={handleMenu} />
      <S.Container>{children}</S.Container>
    </>
  );
};

export default PageWrapper;
