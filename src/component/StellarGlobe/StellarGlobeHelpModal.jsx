import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function StellarGlobeHelpModal({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          ヘルプ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>内容は後で書く</Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onHide} className="btn-style box_border_gray">
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StellarGlobeHelpModal;

StellarGlobeHelpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
