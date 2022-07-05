import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ManualAlertModal({
  manualAlertModalShow,
  onClickOk,
  alertMessage,
  alertButtonMessage,
}) {
  return (
    <Modal show={manualAlertModalShow} size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">アラート</Modal.Title>
      </Modal.Header>
      <Modal.Body>{alertMessage}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="success" onClick={() => onClickOk()}>
          {alertButtonMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ManualAlertModal;

ManualAlertModal.propTypes = {
  manualAlertModalShow: PropTypes.bool.isRequired,
  onClickOk: PropTypes.func.isRequired,
  alertMessage: PropTypes.string.isRequired,
  alertButtonMessage: PropTypes.string.isRequired,
};
