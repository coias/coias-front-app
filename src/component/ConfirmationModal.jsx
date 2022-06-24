import React from 'react';
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
}) {
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
        {positionList[activeKey] && (
          <p>
            {`H${'000000'.slice(
              (leadStarNumber + activeKey).toString().length - 6,
            )}${leadStarNumber + activeKey}を削除しますか？`}
          </p>
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
  onExit: PropTypes.func.isRequired,
  onClickYes: PropTypes.func.isRequired,
  positionList: PropTypes.arrayOf(PropTypes.array).isRequired,
  activeKey: PropTypes.number.isRequired,
  leadStarNumber: PropTypes.number.isRequired,
};
