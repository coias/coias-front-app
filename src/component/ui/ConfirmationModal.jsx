import React, { useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ConfirmationModal({
  show,
  onHide,
  positionList,
  activeKey,
  leadStarNumber,
  onClickYes,
  onExit,
  confirmMessage,
}) {
  const generateConfirmMessage = useCallback(
    () =>
      `H${'000000'.slice((leadStarNumber + activeKey).toString().length - 6)}${
        leadStarNumber + activeKey
      }${confirmMessage}`,
    [confirmMessage],
  );
  return (
    <Modal
      show={show}
      onHide={onHide}
      onExit={onExit}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">確認</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {positionList[activeKey] ? (
          <p>{generateConfirmMessage()}</p>
        ) : (
          <p>{confirmMessage}</p>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button onClick={onHide}>いいえ</Button>
        <Button variant="danger" onClick={onClickYes}>
          はい
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onExit: PropTypes.func,
  onClickYes: PropTypes.func.isRequired,
  confirmMessage: PropTypes.string.isRequired,
  positionList: PropTypes.arrayOf(PropTypes.array),
  activeKey: PropTypes.number,
  leadStarNumber: PropTypes.number,
};

ConfirmationModal.defaultProps = {
  positionList: [],
  activeKey: 0,
  leadStarNumber: 0,
  onExit: () => {},
};
