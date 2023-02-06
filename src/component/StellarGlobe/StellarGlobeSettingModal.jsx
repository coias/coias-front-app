import React from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function StellarGlobeSettingModal({
  show,
  onHide,
  selectMultipleDates,
  setSelectMultipleDates,
  selectImageMode,
  setSelectImageMode,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="stellar_globe_setting_modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>複数観測日の画像の一括選択可否</h4>
        <Row className="setting_modal-content_wrap">
          <Col>
            <Form.Check
              name="group1"
              label="不可"
              type="radio"
              onChange={() => setSelectMultipleDates(false)}
              defaultChecked={!selectMultipleDates && 'true'}
            />
          </Col>
          <Col>
            <Form.Check
              name="group1"
              label="可能"
              type="radio"
              onChange={() => setSelectMultipleDates(true)}
              defaultChecked={selectMultipleDates && 'true'}
            />
          </Col>
        </Row>
        <h4 style={{ paddingTop: '30px' }}>
          画像選択モード/鑑賞モードの切り替え
        </h4>
        <Row className="setting_modal-content_wrap">
          <Col>
            <Form.Check
              name="group2"
              label="画像選択モード"
              type="radio"
              onChange={() => setSelectImageMode(true)}
              defaultChecked={selectImageMode && 'true'}
            />
          </Col>
          <Col>
            <Form.Check
              name="group2"
              label="鑑賞モード"
              type="radio"
              onChange={() => setSelectImageMode(false)}
              defaultChecked={!selectImageMode && 'true'}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onHide} className="btn-style box_border_gray">
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StellarGlobeSettingModal;

StellarGlobeSettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  selectMultipleDates: PropTypes.bool.isRequired,
  setSelectMultipleDates: PropTypes.func.isRequired,
  selectImageMode: PropTypes.bool.isRequired,
  setSelectImageMode: PropTypes.func.isRequired,
};
