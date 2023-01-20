import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function AlertModal({
  alertModalShow,
  onClickOk,
  alertMessage,
  alertButtonMessage,
}) {
  return (
    <Modal show={alertModalShow} size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="f-modal_title f-ja"
        >
          エラー
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#5c636a' }} className="f-ja">
        {alertMessage}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button
          variant="success"
          className="btn-style box_blue f-ja"
          onClick={() => onClickOk()}
        >
          {alertButtonMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;

AlertModal.propTypes = {
  alertModalShow: PropTypes.bool.isRequired,
  onClickOk: PropTypes.func.isRequired,
  alertMessage: PropTypes.string.isRequired,
  alertButtonMessage: PropTypes.string.isRequired,
};
