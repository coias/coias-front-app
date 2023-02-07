import React, { useState, useEffect } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

import PropTypes from 'prop-types';

function NewStarModal({ show, onExit, onClickFinishButton }) {
  const [newName, setNewName] = useState('1');
  const [disable, setDisable] = useState(true);
  const [alertMessage, setAlertMessage] = useState(
    '変更を加えない場合は次へを押してください',
  );

  // initialization
  useEffect(() => {
    setNewName('1');
    setDisable(true);
  }, [show]);

  const keyPress = (e) => {
    e.stopPropagation();
  };

  const validation = () => /\d{1,6}/g.test(newName);
  return (
    <Modal
      show={show}
      onExit={onExit}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="f-modal_title f-ja"
        >
          新天体の番号指定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (validation()) {
              onClickFinishButton(newName);
              setAlertMessage('変更を加えない場合は次へを押してください');
              onExit();
              setAlertMessage('変更を加えない場合は次へを押してください');
            } else {
              setAlertMessage('数字を入力してください');
            }
          }}
        >
          <Form.Group className="f-en">
            <Form.Label>先頭の新天体番号を指定する(最大６桁)</Form.Label>
            <Form.Control
              placeholder="H000005の場合 '5' を入力"
              disabled={disable}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              maxLength={6}
              onKeyDown={keyPress}
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
            className="mb-3 f-ja"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            controlId="formBasicCheckbox"
          >
            <Form.Check
              onChange={() => {
                setDisable(!disable);
                setNewName('1');
              }}
              type="checkbox"
              label="変更する"
            />
            <Button type="submit" className="btn-style box_blue">
              次へ
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewStarModal;

NewStarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickFinishButton: PropTypes.func.isRequired,
};
