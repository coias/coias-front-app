import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ErrorModal({ errorNumber, show, setShow }) {
  const handleClose = () => {
    setShow(false);
  };

  const errorPlace = (num) => {
    const errorTenth = Math.floor(num / 1) % 10;
    switch (errorTenth) {
      case 1:
        return '事前処理';
      case 2:
        return 'ビニングマスク';
      case 3:
        return '軌道取得(確定番号)';
      case 4:
        return '軌道取得(仮符号)';
      case 5:
        return '自動検出';
      case 6:
        return '探索モード後処理';
      case 7:
        return 'レポートモード前処理';
      case 8:
        return '手動測定後処理';
      default:
        return '';
    }
  };

  const errorReason = (num) => {
    const errorFirst = Math.floor(num / 10) % 10;
    switch (errorFirst) {
      case 1:
        return '5枚のwarp画像をアップロードしてから解析をして下さい。';
      case 2:
        return 'インターネットに接続してから解析をして下さい。';
      case 3:
        return '軌道取得を数回やり直して下さい';
      case 4:
        return '必要な中間ファイルがありません。全自動処理を中止し、いくつか前の適切な処理からやり直して下さい。数回やり直しを行ってもエラーが出る場合、開発者にlog.txtをメールで送信してください。';
      case 5:
        return '予期せぬエラーが発生しました。数回やり直してもエラーが出る場合、開発者にlog.txtをメールで送信して下さい。';
      default:
        return '';
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>エラーが発生しました</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorPlace(errorNumber)}でエラーが発生しました。
        <br />
        <br />
        {errorReason(errorNumber)}
        <br />
        <br />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" downloads="log.txt">
          Downloads
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
  errorNumber: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};
