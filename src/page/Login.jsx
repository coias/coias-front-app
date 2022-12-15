import * as React from 'react';
import { useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web';
import { Button, Row } from 'react-bootstrap';

function LoginPage() {
  const location = useLocation();
  const currentLocationState = location.state || {
    from: { pathname: '/' },
  };

  const { keycloak } = useKeycloak();

  const login = useCallback(() => {
    keycloak?.login();
  }, [keycloak]);

  if (keycloak?.authenticated) {
    return <Navigate to={currentLocationState?.from.pathname} />;
  }

  return (
    <div style={{ height: '10%', width: '10%' }}>
      <Row>
        <h1 className="text-center">COIAS</h1>
      </Row>
      <Row>
        <img alt="" src="/icon.png" />
      </Row>
      <Row>
        <Button onClick={login}>Login</Button>
      </Row>
    </div>
  );
}

export default LoginPage;
