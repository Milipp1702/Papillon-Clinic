import { Routes as Switch, Route } from 'react-router-dom';
import { SCREEN_PATHS } from '../constants/paths';

import PrivateRoutes from './PrivateRoutes';
import Login from '../pages/Login';
import Home from '../pages/Home';
import RegisterPatient from '../pages/RegisterPatient';
import RegisterProfessional from '../pages/RegisterProfessional';
import Patients from '../pages/Patients';
import Professionals from '../pages/Professionals';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={SCREEN_PATHS.login} element={<Login />} />
      <Route element={<PrivateRoutes />}>
        {/* ADD PRIVATE ROUTES HERE */}
        <Route path={SCREEN_PATHS.home} element={<Home />} />
        <Route
          path={SCREEN_PATHS.registerPatient}
          element={<RegisterPatient />}
        />
        <Route
          path={SCREEN_PATHS.registerProfessional}
          element={<RegisterProfessional />}
        />
        <Route path={SCREEN_PATHS.patients} element={<Patients />}></Route>
        <Route
          path={SCREEN_PATHS.professionals}
          element={<Professionals />}
        ></Route>
        <Route
          path={SCREEN_PATHS.patient}
          element={<RegisterPatient />}
        ></Route>
        <Route
          path={SCREEN_PATHS.professional}
          element={<RegisterProfessional />}
        ></Route>
      </Route>
    </Switch>
  );
};

export default Routes;
