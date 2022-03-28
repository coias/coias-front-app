import { React } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

function LoadingButton({ loading }) {
  return (
    <Button
      type="button"
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        zIndex: 100,
        backgroundColor: '#0000004f',
        top: 0,
        left: 0,
        display: loading ? 'block' : 'none',
        cursor: 'default',
      }}
    >
      <Spinner
        animation="border"
        style={{
          width: '50px',
          height: '50px',
        }}
      />
      <div id="current-process">処理中...</div>
    </Button>
  );
}

LoadingButton.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default LoadingButton;
