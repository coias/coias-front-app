import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ConfirmationModal({ show, onHide }) {
  const [isNew, setIsNew] = useState(false);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">表示設定</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="新しい天体ですか？"
            onChange={() => setIsNew(!isNew)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>新しい天体の名前</Form.Label>
          <Form.Control placeholder="" disabled={!isNew} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>閉じる</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
