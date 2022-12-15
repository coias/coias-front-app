/* eslint-disable no-restricted-globals */
import React, { useContext, useState } from 'react';
import { Button, Row, Modal, Form, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ModeStatusContext, ReportDoneContext } from '../../functional/context';

// eslint-disable-next-line no-use-before-define
ParamsSettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  parameters: PropTypes.objectOf(PropTypes.string).isRequired,
  setParameters: PropTypes.func.isRequired,
  setMenunames: PropTypes.func.isRequired,
  inputFileLength: PropTypes.number.isRequired,
};

function ParamsSettingModal({
  show,
  handleClose,
  parameters,
  setParameters,
  setMenunames,
  inputFileLength,
}) {
  const [validated, setValidated] = useState(false);
  const { setModeStatus } = useContext(ModeStatusContext);
  const { setReportDone } = useContext(ReportDoneContext);

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>パラメータを設定する</Modal.Title>
      </Modal.Header>
      <Form
        noValidate
        validated={validated}
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
          } else {
            handleClose();
            setValidated(false);
            const isChangedArray = Object.values(parameters).map(
              (parameter, index) => parameter !== event.target[index].value,
            );
            if (isChangedArray[2]) {
              setMenunames((prevMenunames) =>
                prevMenunames.map((items) =>
                  items.name === 'ビニングマスク' || items.name === '自動検出'
                    ? {
                        id: items.id,
                        name: items.name,
                        query: items.query,
                        done: false,
                      }
                    : items,
                ),
              );
              setModeStatus({
                COIAS: false,
                Manual: false,
                Report: false,
                FinalCheck: false,
              });
              setReportDone(false);
            } else if (isChangedArray[0] || isChangedArray[1]) {
              setMenunames((prevMenunames) =>
                prevMenunames.map((items) =>
                  items.name === '自動検出'
                    ? {
                        id: items.id,
                        name: items.name,
                        query: items.query,
                        done: false,
                      }
                    : items,
                ),
              );
              setModeStatus({
                COIAS: false,
                Manual: false,
                Report: false,
                FinalCheck: false,
              });
              setReportDone(false);
            }
            setParameters({
              nd: event.target[0].value,
              ar: event.target[1].value,
              sn: event.target[2].value,
            });
          }
        }}
      >
        <Modal.Body className="mx-2">
          <Row style={{ whiteSpace: 'nowrap' }}>
            <Row className="params-input-group">
              <Col>
                <p>最低検出画像枚数</p>
              </Col>
              <Col md={7}>
                <Form.Group>
                  <Form.Control
                    required
                    type="number"
                    min={1}
                    max={inputFileLength}
                    defaultValue={parameters.nd}
                    className="params-input"
                    placeholder="初期値は4"
                    pattern="\d+"
                  />
                  <Form.Control.Feedback type="invalid">
                    画像枚数以下の整数を入力してください
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="params-input-group">
              <Col>
                <p>自動測光半径</p>
              </Col>
              <Col md={7}>
                <Form.Group>
                  <Form.Control
                    required
                    defaultValue={parameters.ar}
                    className="params-input"
                    placeholder="初期値は6"
                    pattern="\d+"
                    maxLength={3}
                    min={1}
                  />
                  <Form.Control.Feedback type="invalid">
                    1以上の整数を入力してください
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="params-input-group">
              <Col>
                <p>検出光源数</p>
              </Col>
              <Col md={7}>
                <Form.Group>
                  <Form.Control
                    required
                    defaultValue={parameters.sn}
                    className="params-input"
                    placeholder="初期値は500"
                    pattern="\d+"
                    maxLength={5}
                    min={1}
                  />
                  <Form.Control.Feedback type="invalid">
                    1以上の整数を入力してください
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Row>
          <Form.Control.Feedback type="invalid">
            ファイルを選択してください。
          </Form.Control.Feedback>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
          <Button variant="primary" type="submit">
            変更
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ParamsSettingModal;
