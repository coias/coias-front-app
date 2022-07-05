import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function AlertModal({ manualAlertModalShow, onClickOk, title }) {
  return (
    <Modal show={manualAlertModalShow} size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>再描画を行ってください</Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="success" onClick={() => onClickOk()}>
          探索/再描画に戻る
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;

AlertModal.propTypes = {
  manualAlertModalShow: PropTypes.bool.isRequired,
  onClickOk: PropTypes.func.isRequired,
  title: PropTypes.
};
