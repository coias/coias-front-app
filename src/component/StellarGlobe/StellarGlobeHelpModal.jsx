import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AiFillSetting } from 'react-icons/ai';
import { BsFileEarmarkCheckFill, BsFileEarmarkXFill } from 'react-icons/bs';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import CONSTANT from '../../utils/CONSTANTS';

function StellarGlobeHelpModal({ show, onHide }) {
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
        {' '}
        <Table striped bordered>
          <tbody className="help-modal-table">
            <tr>
              <td
                className="f-ja"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                移動
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  画面をドラッグすると視線の方向を移動させることができます
                </h4>
              </td>
            </tr>
            <tr>
              <td
                className="f-ja"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                拡大縮小
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  スクロール操作
                  (マウスのホイールを回転させる、トラックバッドの上を2本指でスライドする、など)
                  で視野の広さを拡大縮小できます
                </h4>
              </td>
            </tr>
            <tr>
              <td
                className="f-ja"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                戻る
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  拡大しすぎて迷子になった時など、左上の「領域」ボタンもしくは「全天に戻る」ボタンを押すことで適切な視野に戻ることができます
                </h4>
              </td>
            </tr>
            <tr>
              <td
                className="f-ja"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                手動選択
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  夜空に表示されている枠を選ぶことでその中にある画像を選択できます。大領域
                  <HiOutlineArrowSmRight />
                  小領域
                  <HiOutlineArrowSmRight />
                  観測日
                  <HiOutlineArrowSmRight />
                  画像、の順で絞り込んでいきます
                </h4>
              </td>
            </tr>
            <tr>
              <td
                className="f-ja"
                style={{ align: 'center', fontSize: '150%', color: '#5c636a' }}
              >
                自動選択
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  「自動選択」ボタンを押すことで解析しやすいおすすめの画像を自動で選ぶことができます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <BsFileEarmarkCheckFill
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  画像の選択状況を確認できます。画像選択中はアイコンが緑色になり、横に選択画像枚数が表示されます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <BsFileEarmarkXFill
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  画像の選択をキャンセルできます
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <AiFillSetting
                  size={CONSTANT.iconSize28px}
                  color={CONSTANT.btnColorGray}
                />
              </td>
              <td>
                <h4 className="f-modal_title_sub f-ja">
                  設定モーダルを開きます。複数日にまたがり画像を選ぶことを可能にすること、画像選択モード・鑑賞モードの切り替え、ができます
                </h4>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={onHide} className="btn-style box_border_gray">
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StellarGlobeHelpModal;

StellarGlobeHelpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
