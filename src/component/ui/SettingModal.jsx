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
  disableShowAutoSave,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="setting_modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="f-modal_title f-ja"
        >
          表示設定
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="f-ja f-modal_title_sub">表示する画像の設定</h4>
        <Row className="setting_modal-content_wrap">
          <Row className="f-ja">
            <Col sm={8}>画像</Col>
            <Col style={{ textAlign: 'center' }}>画像表示</Col>
            <Col style={{ textAlign: 'center' }}>マスクなし</Col>
          </Row>
          <hr />
          {imageURLs.map((img) => (
            <Row key={img.name} className="content_wrap-table">
              <Col sm={8} className="f-en">
                {img.name}
              </Col>
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
        </Row>
        {defaultZoomRate !== 0 && (
          <>
            <h4 className="f-ja f-modal_title_sub">
              手動測定時の拡大モーダルの拡大率を選択
            </h4>
            <Form className="setting_modal-content_wrap f-ja">
              <Row>
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
        {!disableShowAutoSave && (
          <>
            <h4 className="f-ja f-modal_title_sub">
              オートセーブ ON/OFF 切り替え
            </h4>
            <Row className="setting_modal-content_wrap">
              <Col>
                <Form.Check
                  name="group2"
                  label="ON"
                  type="radio"
                  onChange={() => setIsAutoSave(true)}
                  defaultChecked={isAutoSave && 'true'}
                  className="f-en"
                  style={{ fontWeight: 600 }}
                />
              </Col>
              <Col>
                <Form.Check
                  name="group2"
                  label="OFF"
                  type="radio"
                  onChange={() => setIsAutoSave(false)}
                  defaultChecked={!isAutoSave && 'true'}
                  className="f-en"
                  style={{ fontWeight: 600 }}
                />
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onHide} className="btn-style box_border_gray f-ja">
          閉じる
        </Button>
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
  disableShowAutoSave: PropTypes.bool.isRequired,
};
