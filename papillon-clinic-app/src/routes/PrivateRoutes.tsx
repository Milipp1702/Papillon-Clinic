import { Navigate, Outlet } from 'react-router-dom';
import { SCREEN_PATHS } from '../constants/paths';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const PrivateRoutes = () => {
  const { user } = useContext(AuthContext);

  return user && user.token ? (
    <Outlet />
  ) : (
    <Navigate to={`${SCREEN_PATHS.login}`} />
  );
};

export default PrivateRoutes;
