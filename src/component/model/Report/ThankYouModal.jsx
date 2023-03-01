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
    <Modal
      show={thankYouModalShow}
      size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          測定完了です!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#5c636a', whiteSpace: 'pre-line' }}>
        <h3>
          <b>{thankYouMessageBig}</b>
        </h3>
        <h3>{thankYouMessageSmall}</h3>
        <h4>{'次の測定へ進みましょう!\n'}</h4>
        <aside>
          報告いただいた情報は小惑星センター(MPC)にて保管され、追観測に成功したものが新天体と認められます。詳しく知りたい方は、
          <a
            href="https://web-coias.u-aizu.ac.jp/about_coias"
            target="_blank"
            rel="noopener noreferrer"
          >
            「小惑星の発見と名前がつくまで」
          </a>
          をご覧ください。
        </aside>
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
