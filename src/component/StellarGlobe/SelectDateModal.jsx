/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';

function SelectDateModal({
  show,
  onExit,
  onClickOkButton,
  observedDates,
  setObservedDates,
  selectedDateIds,
  setSelectedDateIds,
  selectMultipleDates,
}) {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (selectMultipleDates) {
      let NSelectedDates = 0;
      Object.keys(observedDates).forEach((key) => {
        if (observedDates[key].isSelected) NSelectedDates += 1;
      });
      setDisabled(NSelectedDates === 0);
    } else {
      setDisabled(selectedDateIds === undefined);
    }
  }, [observedDates, selectedDateIds]);
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
      <Modal.Body style={{ overflowY: 'scroll' }}>
        <Table striped className="selected-files-table">
          <thead>
            <tr>
              <th>観測日</th>
              <th>解析率</th>
              <th>選択</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(observedDates).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{`${Math.floor(observedDates[key].progress * 100.0)}%`}</td>
                <td>
                  {selectMultipleDates ? (
                    <Form.Check
                      id={`check-${observedDates[key].dir_id}`}
                      value={observedDates[key].dir_id}
                      type="checkbox"
                      name="group1"
                      defaultChecked={false}
                      onChange={(e) => {
                        const newObservedDates = JSON.parse(
                          JSON.stringify(observedDates),
                        );
                        newObservedDates[key].isSelected = e.target.checked;
                        setObservedDates(newObservedDates);
                      }}
                    />
                  ) : (
                    <Form.Check
                      id={`radio-${observedDates[key].dir_id}`}
                      value={observedDates[key].dir_id}
                      type="radio"
                      name="group2"
                      onChange={(e) => {
                        setSelectedDateIds([e.currentTarget.value]);
                      }}
                    />
                  )}
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
            let tmpSelectedDateIds;
            if (selectMultipleDates) {
              tmpSelectedDateIds = [];
              Object.keys(observedDates).forEach((key) => {
                if (observedDates[key].isSelected) {
                  tmpSelectedDateIds.push(observedDates[key].dir_id);
                }
              });
            } else {
              tmpSelectedDateIds = selectedDateIds;
            }
            onClickOkButton(tmpSelectedDateIds);
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
  observedDates: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
  setObservedDates: PropTypes.func.isRequired,
  selectedDateIds: PropTypes.number.isRequired,
  setSelectedDateIds: PropTypes.func.isRequired,
  selectMultipleDates: PropTypes.bool.isRequired,
};
