/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';

function SelectDateModal({
  show,
  onExit,
  onClickOkButton,
  observedDates,
  selectedDateId,
  setSelectedDateId,
}) {
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
          解析したい画像の観測日を選択
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered>
          <tbody className="select-date-modal-table">
            <tr>
              <td>観測日</td>
              <td>解析率</td>
              <td>選択</td>
            </tr>
            {Object.keys(observedDates).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{`${Math.floor(observedDates[key].progress * 100.0)}%`}</td>
                <td>
                  <Form.Check
                    id={`radio-${observedDates[key].dir_id}`}
                    value={observedDates[key].dir_id}
                    type="radio"
                    name="group1"
                    onChange={(e) => {
                      setSelectedDateId(e.currentTarget.value);
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
          disabled={selectedDateId === undefined}
          onClick={() => {
            onClickOkButton(selectedDateId);
            onExit();
          }}
          className="btn-style box_blue justify-content-right"
        >
          決定
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SelectDateModal;

SelectDateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickOkButton: PropTypes.func.isRequired,
  observedDates: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedDateId: PropTypes.number.isRequired,
  setSelectedDateId: PropTypes.func.isRequired,
};
