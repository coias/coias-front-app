import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ThankYouModal({ thankYouModalShow, onClickOk }) {
  return (
    <Modal show={thankYouModalShow} size="lg" backdrop="static">
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          測定お疲れ様でした
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#5c636a', whiteSpace: 'pre-line' }}>
        {
          '画像の測定ありがとうございました。\n測定結果はMPCおよびCOIAS開発チームにメール送信されました。\nまたの測定をお待ちしております。'
        }
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button
          variant="success"
          className="btn-style box_blue"
          onClick={() => onClickOk()}
        >
          画像選択に戻る
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ThankYouModal;

ThankYouModal.propTypes = {
  thankYouModalShow: PropTypes.bool.isRequired,
  onClickOk: PropTypes.func.isRequired,
};
