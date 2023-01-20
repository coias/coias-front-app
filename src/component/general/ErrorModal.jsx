import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

function ErrorModal({
  show,
  setShow,
  errorPlace,
  errorReason,
  onExit,
  setLoading,
}) {
  const reactApiUri = process.env.REACT_APP_API_URI;

  const downloadLogFIle = () => {
    axios
      .get(`${reactApiUri}log`)
      .then((response) => response.data.result)
      .then((log) => {
        const file = new Blob(
          log.map((item) => `${item}\n`),
          {
            type: 'text/plain',
          },
        );
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'log.txt';
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .catch(() => {
        console.log('エラーが発生しました');
      });
  };

  const handleClose = () => {
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} onExit={onExit} centered>
      <Modal.Header closeButton>
        <Modal.Title className="f-modal_title f-ja">
          エラーが発生しました
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#5c636a' }} className="f-ja">
        {errorPlace?.length === 0
          ? `${errorPlace}`
          : `${errorPlace}でエラーが発生しました。`}
        <br />
        <br />
        {errorReason}
        <br />
        <br />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          className="btn-style box_blue f-ja"
          onClick={() => {
            downloadLogFIle();
          }}
        >
          ログをダウンロード
        </Button>
        <Button
          className="btn-style box_border_blue f-ja"
          onClick={handleClose}
        >
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ErrorModal;

ErrorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  errorPlace: PropTypes.string.isRequired,
  errorReason: PropTypes.string.isRequired,
  onExit: PropTypes.func,
  setLoading: PropTypes.func.isRequired,
};

ErrorModal.defaultProps = {
  onExit: () => {},
};
