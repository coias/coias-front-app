import { React } from 'react';
import { Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styles from './AppToast.module.scss';

function AppToast({ show, title, closeCallback }) {
  return (
    <Toast
      className={styles.app_toast}
      onClose={closeCallback}
      style={{
        display: show ? 'block' : 'none',
      }}
    >
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body id="toast-message">message</Toast.Body>
    </Toast>
  );
}

AppToast.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired,
};

export default AppToast;
