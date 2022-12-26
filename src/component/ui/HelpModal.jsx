import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

import { FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import {
  BiHide,
  BiZoomIn,
  BiZoomOut,
  BiTime,
  BiCurrentLocation,
} from 'react-icons/bi';
import { AiFillSetting } from 'react-icons/ai';
import { ImBrightnessContrast, ImContrast } from 'react-icons/im';
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
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: '#5c636a', fontWeight: 'bold' }}
        >
          ヘルプ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered>
          <tbody className="help-modal-table">
            <tr>
              <td>
                <FaPlay size={30} color="#5c636a" />
              </td>
              <td>
                <h4>ブリンクを開始/停止します。sキーでも同じことができます</h4>
              </td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <FaStepBackward size={30} color="#5c636a" />
                <FaStepForward size={30} color="#5c636a" />
              </td>
              <td>
                <h4>ページを移動します。左右キーでも同じことができます</h4>
              </td>
            </tr>
            <tr>
              <td
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                sec
              </td>
              <td>
                <h4>
                  ブリンク速度を調節できます。入力欄をクリックしてプルダウンリストから速度を選べます
                </h4>
              </td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <BiZoomIn size={30} color="#5c636a" />
                <BiZoomOut size={30} color="#5c636a" />
              </td>
              <td>
                <h4>画像の拡大縮小をします。上下キーでも同じことができます</h4>
              </td>
            </tr>
            <tr>
              <td>
                <BiHide size={30} color="#5c636a" />
              </td>
              <td>
                <h4>天体の枠、天体番号を非表示にします</h4>
              </td>
            </tr>
            <tr>
              <td
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                1
              </td>
              <td>
                <h4>
                  画像番号です。現在の画像の番号は灰色の背景になります。クリックすることでその画像に移動できます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <AiFillSetting size={30} color="#5c636a" />
              </td>
              <td>
                <h4>
                  設定モーダルを開きます。画像の表示有無・画像のマスクの有無・手動測定モードでの拡大率・オートセーブの有無を選べます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <ImBrightnessContrast size={30} color="#5c636a" />
              </td>
              <td>
                <h4>画像の輝度を調節できる調節バーです</h4>
              </td>
            </tr>
            <tr>
              <td>
                <ImContrast size={30} color="#5c636a" />
              </td>
              <td>
                <h4>画像のコントラストを調節できる調節バーです</h4>
              </td>
            </tr>
            <tr>
              <td>
                <BiTime size={30} color="#5c636a" />
              </td>
              <td>
                <h4>表示している画像の撮影時刻です</h4>
              </td>
            </tr>
            <tr>
              <td>
                <BiCurrentLocation size={30} color="#5c636a" />
              </td>
              <td>
                <h4>マウスポインタの位置における画像のピクセル座標です</h4>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer
        className="btn-style_hover"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button
          onClick={onHide}
          style={{
            color: '#5c636a',
            backgroundColor: '#fff',
            border: '3px solid #5c636a',
          }}
        >
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpModal;

HelpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
