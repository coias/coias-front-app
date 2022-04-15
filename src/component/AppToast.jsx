import { React } from 'react';
import { Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';

function AppToast({ show, title, closeCallback, content }) {
  return (
    <Toast
      className="app_toast"
      onClose={closeCallback}
      style={{
        display: show ? 'block' : 'none',
      }}
    >
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body id="toast-message">{content}</Toast.Body>
    </Toast>
  );
}

AppToast.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired,
  content: PropTypes.string,
};

AppToast.defaultProps = {
  content: '',
};

export default AppToast;
