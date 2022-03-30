import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

function SettingModal({ show, onHide, imageURLs }) {
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
        <h4>表示する画像の設定を行ってください。</h4>
        <Row>
          <Col sm={8}>画像</Col>
          <Col style={{ textAlign: 'center' }}>表示/非表示</Col>
          <Col style={{ textAlign: 'center' }}>マスク有無</Col>
        </Row>
        <hr />
        {imageURLs.map((img) => (
          <Row key={img.name} className="mb-5">
            <Col sm={8}>{img.name}</Col>
            <Col className="text-center">
              <input
                type="checkbox"
                defaultChecked={img.visible}
                onChange={(e) => {
                  // eslint-disable-next-line no-param-reassign
                  img.visible = e.target.checked;
                }}
              />
            </Col>
            <Col style={{ textAlign: 'center' }}>
              <input
                type="checkbox"
                defaultChecked={img.nomasked}
                onChange={(e) => {
                  // eslint-disable-next-line no-param-reassign
                  img.nomasked = e.target.checked;
                }}
              />
            </Col>
          </Row>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingModal;

SettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
