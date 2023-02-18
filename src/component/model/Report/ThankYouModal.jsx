import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ThankYouModal({
  thankYouModalShow,
  onClickOk,
  thankYouMessageBig,
  thankYouMessageSmall,
}) {
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
        <h3>
          <b>{thankYouMessageBig}</b>
        </h3>
        <h4>{thankYouMessageSmall}</h4>
        {
          '画像の測定ありがとうございました。\n測定結果は小惑星センター(MPC)およびCOIAS開発チームにメール送信されました。\nまたの測定をお待ちしております。'
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
  thankYouMessageBig: PropTypes.string.isRequired,
  thankYouMessageSmall: PropTypes.string.isRequired,
};
