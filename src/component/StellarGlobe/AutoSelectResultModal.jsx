/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

function AutoSelectResultModal({ show, onExit, autoSelectResult }) {
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
          画像自動選択結果
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`${autoSelectResult.regionName}から画像を${autoSelectResult.warpFiles?.length}枚自動選択しました。`}
        <br />
        {`画像の場所ID: ${autoSelectResult.tractPatch}`}
        <br />
        {`画像の観測日: ${autoSelectResult.observeDate}`}
        <br />
        画像一覧:
        <br />
        <Table striped bordered>
          <tbody className="autoselect-result-modal-table">
            {autoSelectResult.warpFiles?.map((warpFile) => (
              <tr>{warpFile.fileName}</tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onExit}
          className="btn-style box_blue justify-content-center"
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AutoSelectResultModal;

AutoSelectResultModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  autoSelectResult: PropTypes.objectOf(PropTypes.object).isRequired,
};
