import React from 'react';
import { Button, Row, Modal, Form, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-use-before-define
FileUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  fileInput: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  errorFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelect: PropTypes.func.isRequired,
  onClickStarUpdateButton: PropTypes.func.isRequired,
  isAutoProcess: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  alertMessage: PropTypes.string.isRequired,
};

function FileUploadModal({
  show,
  isAutoProcess,
  handleClose,
  handleSubmit,
  fileInput,
  handleChange,
  valid,
  errorFiles,
  handleSelect,
  onClickStarUpdateButton,
  disabled,
  alertMessage,
}) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>ファイルを選択してください</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="mx-3">
          アップロード後、画像処理をおこないます。
          <br />
          処理は時間がかかります。
          <br />
          画像処理は全自動処理と手動処理が選択できます。
          <InputGroup hasValidation className="mt-3">
            <Row>
              <Form.Control
                type="file"
                ref={fileInput}
                onChange={handleChange}
                isInvalid={valid}
                multiple
                className="mx-2"
              />
            </Row>
            <Row>
              {errorFiles.map((element) => (
                <p
                  style={{
                    color: element.startsWith('') && 'red',
                  }}
                >
                  {element}
                </p>
              ))}
            </Row>
          </InputGroup>
          <Form.Check
            className="mt-3"
            inline
            type="radio"
            label="全自動処理"
            name="group1"
            id="auto"
            value="auto"
            onChange={handleSelect}
            checked={isAutoProcess}
          />
          <Form.Check
            className="mt-3"
            inline
            type="radio"
            label="手動処理"
            name="group1"
            id="manual"
            value="manual"
            onChange={handleSelect}
            checked={!isAutoProcess}
          />
          <Button onClick={onClickStarUpdateButton}>小惑星データ更新</Button>
          <Row style={{ whiteSpace: 'nowrap' }}>
            <p
              style={{
                color: 'red',
              }}
              className="mt-1 mb-0"
            >
              {alertMessage}
            </p>
          </Row>
          <Form.Control.Feedback type="invalid">
            ファイルを選択してください。
          </Form.Control.Feedback>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
          <Button variant="primary" type="submit" disabled={disabled}>
            送信
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default FileUploadModal;
