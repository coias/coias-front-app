import * as React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoutes() {
  const { keycloak } = useKeycloak();
  if (keycloak.authenticated) {
    return <Outlet />;
  }
  return <Navigate to="/Login" />;
}

export default PrivateRoutes;
