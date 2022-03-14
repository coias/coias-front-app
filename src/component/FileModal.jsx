import React, { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function FileModal(props) {
  const state = props;
  const fileInput = useRef();
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const uri = `${process.env.REACT_APP_API_URI}uploadfiles/`;
  const handleChange = (e) => {
    // ファイル変更時
    if (e.target.value !== '') {
      setValid(false);
      setDisabled(false);
    } else {
      setValid(true);
      setDisabled(true);
    }
  };
  const handleSubmit = (e) => {
    /* formを使用してファイルを送信
     * 参考リンク
     * https://ja.reactjs.org/docs/forms.html
     * https://developer.mozilla.org/ja/docs/Web/API/FormData/Using_FormData_Objects
     */
    e.preventDefault();
    const { files } = fileInput.current;
    const data = new FormData();
    const request = new XMLHttpRequest();
    const filesForProps = [];

    let file;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      data.append('files', file, file.name);
      filesForProps.push(file.name);
    }

    state.setFileNames(filesForProps);

    request.open('POST', uri);
    request.onload = () => {
      if (request.status === 200) {
        console.log('成功！');
      } else {
        console.log('失敗');
      }
    };
    request.send(data);
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        ファイル
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>ファイルを選択してください</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          アップロード後、画像処理をおこないます。
          <br />
          処理は時間がかかります。
        </Modal.Body>

        <Form onSubmit={handleSubmit} className="m-3">
          <InputGroup hasValidation>
            <Form.Control
              type="file"
              ref={fileInput}
              onChange={handleChange}
              isInvalid={valid}
              multiple
            />
            <Form.Control.Feedback type="invalid">
              ファイルを選択してください。ファイルは複数選択できます。
            </Form.Control.Feedback>
          </InputGroup>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={disabled}>
              send
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
