import React from 'react';
import { Button, Row, Modal, Form, InputGroup, Col } from 'react-bootstrap';
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
  setParameters: PropTypes.func.isRequired,
  setCheckSend: PropTypes.func.isRequired,
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
  setParameters,
  setCheckSend,
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
            <p style={{ fontSize: 20 }} className="px-0 mt-2">
              パラメータの詳細設定
            </p>
            <Col className="pe-0">
              <InputGroup className="my-2">
                <InputGroup.Text
                  style={{
                    backgroundColor: 'white',
                    padding: '6px',
                  }}
                >
                  最低検出画像枚数
                </InputGroup.Text>
                <Form.Control
                  className="form-control-sm"
                  placeholder="初期値は4"
                  onChange={(e) => {
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(e.target.value)) {
                      setCheckSend((prevCheckSend) =>
                        prevCheckSend.map((judge, index) =>
                          index === 1 ? false : judge,
                        ),
                      );
                    } else {
                      setParameters((prevParams) =>
                        prevParams.map((parametar, index) =>
                          index === 1 ? e.target.value : parametar,
                        ),
                      );
                      setCheckSend((prevCheckSend) =>
                        prevCheckSend.map((judge, index) =>
                          index === 1 ? true : judge,
                        ),
                      );
                    }
                  }}
                />
              </InputGroup>
            </Col>
            <Col className="ps-2">
              <InputGroup className="my-2">
                <InputGroup.Text
                  style={{
                    backgroundColor: 'white',
                    padding: '6px',
                  }}
                >
                  自動測光半径
                </InputGroup.Text>
                <Form.Control
                  className="form-control-sm"
                  placeholder="初期値は6"
                  onChange={(e) => {
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(e.target.value)) {
                      setCheckSend((prevCheckSend) =>
                        prevCheckSend.map((judge, index) =>
                          index === 2 ? false : judge,
                        ),
                      );
                    } else {
                      setParameters((prevParams) =>
                        prevParams.map((parametar, index) =>
                          index === 2 ? e.target.value : parametar,
                        ),
                      );
                      setCheckSend((prevCheckSend) =>
                        prevCheckSend.map((judge, index) =>
                          index === 2 ? true : judge,
                        ),
                      );
                    }
                  }}
                />
              </InputGroup>
            </Col>
            <InputGroup className="my-2">
              <InputGroup.Text
                style={{
                  backgroundColor: 'white',
                }}
              >
                検出光源数
              </InputGroup.Text>
              <Form.Control
                className="form-control-sm"
                placeholder="初期値は2000"
                onChange={(e) => {
                  // eslint-disable-next-line no-restricted-globals
                  if (isNaN(e.target.value)) {
                    setCheckSend((prevCheckSend) =>
                      prevCheckSend.map((judge, index) =>
                        index === 3 ? false : judge,
                      ),
                    );
                  } else {
                    setParameters((prevParams) =>
                      prevParams.map((parametar, index) =>
                        index === 3 ? e.target.value : parametar,
                      ),
                    );
                    setCheckSend((prevCheckSend) =>
                      prevCheckSend.map((judge, index) =>
                        index === 3 ? true : judge,
                      ),
                    );
                  }
                }}
              />
            </InputGroup>
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
