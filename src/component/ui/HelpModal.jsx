import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

import { FaMousePointer } from 'react-icons/fa';
import { BiHide } from 'react-icons/bi';
import { RiArrowUpDownFill, RiArrowLeftRightFill } from 'react-icons/ri';
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
          <tbody className="help-modal-table">
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
                <BiHide size={30} />
              </td>
              <td>
                <h4>天体の枠、天体番号を非表示にします</h4>
              </td>
            </tr>
            <tr>
              <td>
                <RiArrowUpDownFill size={30} />
              </td>
              <td>
                <h4>上下キーで拡大縮小をします</h4>
              </td>
            </tr>
            <tr>
              <td>
                <RiArrowLeftRightFill size={30} />
              </td>
              <td>
                <h4>左右キーでページを移動します</h4>
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
