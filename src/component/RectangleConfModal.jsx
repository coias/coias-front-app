import React from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

import PropTypes from 'prop-types';

function RectangleConfModal({ show, onExit, onClickNext, onClickRetry }) {
  return (
    <Modal show={show} onExit={onExit} size="lg">
      <Modal.Header>
        <Modal.Title>長方形の確認</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>この形でよろしいですか？</Form.Label>
          </Form.Group>
          <Form.Group
            className="mb-3"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            controlId="formBasicCheckbox"
          >
            <Button
              variant="danger"
              onClick={() => {
                onClickRetry();
                onExit();
              }}
            >
              やり直す
            </Button>
            <Button
              onClick={() => {
                onClickNext();
                onExit();
              }}
            >
              次へ
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RectangleConfModal;

RectangleConfModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  onClickRetry: PropTypes.func.isRequired,
};
