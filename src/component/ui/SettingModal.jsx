import React from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function SettingModal({
  show,
  onHide,
  imageURLs,
  setDefaultZoomRate,
  defaultZoomRate,
  setIsAutoSave,
  isAutoSave,
}) {
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
          <Col style={{ textAlign: 'center' }}>画像表示</Col>
          <Col style={{ textAlign: 'center' }}>マスクなし</Col>
        </Row>
        <hr />
        {imageURLs.map((img) => (
          <Row key={img.name} className="mb-5">
            <Col sm={8}>{img.name}</Col>
            <Col className="text-center">
              <Form.Check
                type="checkbox"
                defaultChecked={img.visible}
                onChange={(e) => {
                  // eslint-disable-next-line no-param-reassign
                  img.visible = e.target.checked;
                }}
              />
            </Col>
            <Col style={{ textAlign: 'center' }}>
              <Form.Check
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
        {defaultZoomRate !== 0 && (
          <>
            <h4>手動測定時の拡大モーダルの拡大率を選んでください。</h4>
            <Form>
              <Row className="pb-4">
                <Col>
                  <Form.Check
                    name="group1"
                    label="極小"
                    type="radio"
                    onChange={() => setDefaultZoomRate(250)}
                    defaultChecked={defaultZoomRate === 250 && 'true'}
                  />
                </Col>
                <Col>
                  <Form.Check
                    name="group1"
                    label="小"
                    type="radio"
                    onChange={() => setDefaultZoomRate(50)}
                    defaultChecked={defaultZoomRate === 50 && 'true'}
                  />
                </Col>
                <Col>
                  <Form.Check
                    name="group1"
                    label="中"
                    type="radio"
                    onChange={() => setDefaultZoomRate(40)}
                    defaultChecked={defaultZoomRate === 40 && 'true'}
                  />
                </Col>
                <Col>
                  <Form.Check
                    name="group1"
                    label="大"
                    type="radio"
                    onChange={() => setDefaultZoomRate(30)}
                    defaultChecked={defaultZoomRate === 30 && 'true'}
                  />
                </Col>
              </Row>
            </Form>
          </>
        )}
        <h4>オートセーブ</h4>
        <Row>
          <Col>
            <Form.Check
              name="group2"
              label="ON"
              type="radio"
              onChange={() => setIsAutoSave(true)}
              defaultChecked={isAutoSave && 'true'}
              className="m-3"
            />
          </Col>
          <Col>
            <Form.Check
              name="group2"
              label="OFF"
              type="radio"
              onChange={() => setIsAutoSave(false)}
              defaultChecked={!isAutoSave && 'true'}
              className="m-3"
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>閉じる</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingModal;

SettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  // subImageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setDefaultZoomRate: PropTypes.func.isRequired,
  defaultZoomRate: PropTypes.number.isRequired,
  setIsAutoSave: PropTypes.func.isRequired,
  isAutoSave: PropTypes.bool.isRequired,
};
