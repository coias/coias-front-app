/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';

function SelectImageModal({
  show,
  onExit,
  onClickOkButton,
  images,
  setImages,
}) {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    let NSelectedImages = 0;
    Object.keys(images).forEach((key) => {
      if (images[key].isSelected) NSelectedImages += 1;
    });
    if (NSelectedImages < 4) setDisabled(true);
    else setDisabled(false);
  }, [images]);
  return (
    <Modal
      show={show}
      onExit={() => {
        onExit();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          解析したい画像を選択(4枚以上選択)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: 'scroll' }}>
        <Table striped className="selected-files-table">
          <thead>
            <tr>
              <th>画像名</th>
              <th>自動測定状況</th>
              <th>手動測定状況</th>
              <th>選択</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(images).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{images[key].isAutoMeasured ? '解析済' : '未解析'}</td>
                <td>{images[key].isManualMeasured ? '解析済' : '未解析'}</td>
                <td>
                  <Form.Check
                    id={`check-${key}`}
                    value={key}
                    defaultChecked={false}
                    type="checkbox"
                    name="group1"
                    onChange={(e) => {
                      const newImages = JSON.parse(JSON.stringify(images));
                      newImages[key].isSelected = e.target.checked;
                      setImages(newImages);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onExit}
          className="btn-style box_border_gray justify-content-left"
        >
          キャンセル
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            onClickOkButton(images);
            onExit();
          }}
          className="btn-style box_blue justify-content-right"
        >
          {disabled ? '4枚以上選択してください' : '決定'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SelectImageModal;

SelectImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickOkButton: PropTypes.func.isRequired,
  images: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  setImages: PropTypes.func.isRequired,
};
