import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

function ErrorModal({ show, setShow, errorPlace, errorReason }) {
  const [log, setLog] = useState({});

  const downloadFIle = () => {
    axios
      .get('http://localhost:8000/log')
      .then((response) => {
        setLog(response.data.result);
      })
      .catch(() => {
        console.log('エラーが発生しました');
      });
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
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>エラーが発生しました</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorPlace}でエラーが発生しました。
        <br />
        <br />
        {errorReason}
        <br />
        <br />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            downloadFIle();
          }}
        >
          Download log
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
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
};
