import * as React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { keycloak } = useKeycloak();
  console.log(<Outlet />);
  return keycloak?.authenticated ? <Outlet /> : <Navigate to="/Login" />;
}

export default PrivateRoute;
