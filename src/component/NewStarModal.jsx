import React, { useState } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

import PropTypes from 'prop-types';

function NewStarModal({
  show,
  onHide,
  onExit,
  onClickFinishButton,
  newName,
  setNewName,
}) {
  const [disable, setDisable] = useState(true);
  const [alertMessage, setAlertMessage] = useState(
    '変更を加えない場合は次へを押してください',
  );

  const validation = () => {
    const pattern = /\d{1,6}/g;
    const result = newName.match(pattern);
    return result !== null && result[0] === newName;
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setDisable(!disable);
        onHide();
      }}
      onExit={onExit}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          新天体の番号指定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (validation()) {
              onClickFinishButton(newName);
              setDisable(!disable);
              onExit();
            } else {
              setAlertMessage('数字を入力してください');
            }
          }}
        >
          <Form.Group>
            <Form.Label>先頭の新天体番号を指定する</Form.Label>
            <Form.Control
              placeholder="H000005の場合 '5' を入力"
              disabled={disable}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
            <Form.Text className="text-muted">
              <p
                style={{
                  color: alertMessage.startsWith('数') && 'red',
                }}
              >
                {alertMessage}
              </p>
            </Form.Text>
          </Form.Group>
          <Form.Group
            className="mb-3"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            controlId="formBasicCheckbox"
          >
            <Form.Check
              onChange={() => {
                setDisable(!disable);
              }}
              type="checkbox"
              label="変更する"
            />
            <Button type="submit">次へ</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewStarModal;

NewStarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickFinishButton: PropTypes.func.isRequired,
  setNewName: PropTypes.func.isRequired,
  newName: PropTypes.string.isRequired,
};
