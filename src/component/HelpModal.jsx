import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import PropTypes from 'prop-types';

function HelpModal({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">ヘルプ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>
                <h4>Alt</h4>
              </td>
              <td>
                <h4>
                  Altキーを押しながらスクロール操作で、ズームイン・アウトできます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <FaHandPaper size={30} />
              </td>
              <td>
                <h4>
                  画面をクリックしたまま、画像を動かすことが可能になります
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <FaMousePointer size={30} />
              </td>
              <td>
                <h4>天体の枠をクリックして選択可能になります</h4>
              </td>
            </tr>
            <tr>
              <td>
                <AiOutlineReload size={30} />
              </td>
              <td>
                <h4>全ての状態がリセットされます</h4>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>閉じる</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpModal;

HelpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
