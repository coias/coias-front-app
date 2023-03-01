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
import CONSTANT from '../../utils/CONSTANTS';

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
          className="f-modal_title f-ja"
        >
          ヘルプ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered>
          <tbody className="help-modal-table">
            <tr>
              <td>
                <FaPlay
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                ブリンクを開始/停止します。sキーでも同じことができます
              </td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <FaStepBackward
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
                <FaStepForward
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                ページを移動します。左右キーでも同じことができます
              </td>
            </tr>
            <tr>
              <td
                className="f-en"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                sec
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                ブリンク速度を調節できます。入力欄をクリックしてプルダウンリストから速度を選べます
              </td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <BiZoomIn
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
                <BiZoomOut
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                画像の拡大縮小をします。上下キーでも同じことができます
              </td>
            </tr>
            <tr>
              <td>
                <BiHide
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                天体の枠、天体番号を非表示にします
              </td>
            </tr>
            <tr>
              <td
                className="f-en"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                1
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                画像番号です。現在の画像の番号は灰色の背景になります。クリックすることでその画像に移動できます
              </td>
            </tr>
            <tr>
              <td>
                <AiFillSetting
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                設定モーダルを開きます。画像の表示有無・画像のマスクの有無・手動測定モードでの拡大率・オートセーブの有無を選べます
              </td>
            </tr>
            <tr>
              <td>
                <ImBrightnessContrast
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                画像の輝度を調節できる調節バーです
              </td>
            </tr>
            <tr>
              <td>
                <ImContrast
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                画像のコントラストを調節できる調節バーです
              </td>
            </tr>
            <tr>
              <td>
                <BiTime
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                表示している画像の撮影時刻(世界時)です
              </td>
            </tr>
            <tr>
              <td>
                <BiCurrentLocation
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td
                className="f-ja"
                style={{ textAlign: 'left', fontSize: '130%' }}
              >
                マウスポインタの位置における画像のピクセル座標です
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onHide} className="btn-style box_border_gray f-ja">
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
