import axios from 'axios';
import React, { useState, useRef } from 'react';
import {
  Button,
  Row,
  Col,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { AiOutlineArrowRight } from 'react-icons/ai';
import LoadingButton from '../component/LoadingButton';
import AppToast from '../component/AppToast';

/**
 * 2022.03.24 y changed.
 * 全自動だけ段分け。
 */
function ExplorePrepare() {
  const [menunames, setMenunames] = useState([
    { id: 1, name: 'ファイル', query: '', done: false },
    { id: 2, name: '事前処理', query: 'preprocess', done: false },
    {
      id: 3,
      name: 'ビニングマスク',
      query: 'startsearch2R?binning=',
      done: false,
    },
    {
      id: 4,
      name: '軌道取得（確定番号）',
      query: 'prempsearchC-before',
      done: false,
    },
    {
      id: 5,
      name: '軌道取得（仮符号）',
      query: 'prempsearchC-after',
      done: false,
    },
    { id: 6, name: '自動検出', query: 'astsearch_new', done: false },
    { id: 7, name: '全自動処理', query: 'AstsearchR?binning=', done: false },
  ]);

  const uri = process.env.REACT_APP_API_URI;
  const [fileNames, setFileNames] = useState(['Please input files']);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const fileInput = useRef();
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const handleClose = () => {
    setMenunames(menunames);
    setShow(false);
  };
  const handleShow = () => setShow(true);
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
    const filesForProps = [];

    let file;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      data.append('files', file, file.name);
      filesForProps.push(file.name);
    }

    setFileNames(filesForProps);

    const postFiles = async () => {
      handleClose();
      document.getElementById('current-process').innerHTML =
        'アップロード中...';
      setLoading(true);
      // await axios.delete(`${uri}deletefiles`);
      await axios
        .post(`${uri}uploadfiles/`, data)
        .then(() => {
          menunames[0].done = true;
          setMenunames(menunames);
          setLoading(false);
        })
        .catch(() => {
          document.getElementById('toast-message').innerHTML =
            'ファイルアップロードが失敗しました';
          setShowError(true);
          setLoading(false);
        });
    };

    postFiles();
  };

  const onProcess = (query) => {
    document.getElementById('current-process').innerHTML = '処理中...';
    const put = async () => {
      setLoading(true);

      await axios
        .put(uri + query)
        .then(() => {
          const updatedMenunames = menunames.map((item) => {
            if (
              item.query === query ||
              (query.startsWith('startsearch2R?binning=') &&
                item.query.startsWith('startsearch2R?binning='))
            ) {
              // eslint-disable-next-line no-param-reassign
              item.done = true;
            }
            return item;
          });
          setMenunames(updatedMenunames);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setShowError(true);
          console.error(error);
          document.getElementById(
            'toast-message',
          ).innerHTML = `${error} : 処理が失敗しました`;
        });
    };
    if (query.length > 0) put();
  };

  /**
   * 処理の処理をまとめたモノ？
   *
   * @param {通信先} url
   * @param {処理名} query
   * @returns
   */
  const onProcessExecute = async (url, query) => {
    let result = true;
    const uriQuery = url.split('/')[3];
    document.getElementById('current-process').innerHTML = `${query}...`;
    await axios
      .put(url)
      .then(() => {
        const updatedMenunames = menunames.map((item) => {
          if (
            item.query === uriQuery ||
            (uriQuery.startsWith('startsearch2R?binning=') &&
              item.query.startsWith('startsearch2R?binning='))
          ) {
            // eslint-disable-next-line no-param-reassign
            item.done = true;
          }
          return item;
        });
        setMenunames(updatedMenunames);
      })
      .catch(() => {
        result = false;
        document.getElementById(
          'toast-message',
        ).innerHTML = `${query}が失敗しました`;
      });
    if (!result) {
      setLoading(false);
      setShowError(true);
    }
    return result;
  };

  /**
   * 全自動処理。
   *
   * @param {ビニングマスクのサイズ} size
   * @returns
   */
  const onProcessAuto = async (size) => {
    // 事前処理
    setLoading(true);
    let result = true;
    result = await onProcessExecute(`${uri}preprocess`, '事前処理');
    if (!result) {
      return;
    }
    // ビニングマスク（size: 2 or 4）
    result = await onProcessExecute(
      `${uri}startsearch2R?binning=${size}`,
      `ビニングマスク（${size === 2 ? '2x2' : '4x4'}）`,
    );
    if (!result) {
      return;
    }
    // 軌道取得（確定番号）
    result = await onProcessExecute(
      `${uri}prempsearchC-before`,
      '軌道取得（確定番号）',
    );
    if (!result) {
      return;
    }
    // 軌道取得（仮符号）
    result = await onProcessExecute(
      `${uri}prempsearchC-after`,
      '軌道取得（仮符号）',
    );
    if (!result) {
      return;
    }

    // 自動検出
    await onProcessExecute(`${uri}astsearch_new`, '自動検出');

    menunames[6].done = true;
    setMenunames(menunames);
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: '20px',
        height: '100%',
      }}
    >
      <Row xs="auto">
        <Col>
          <h4>探索準備 : </h4>
        </Col>
        <Col>
          <div className="d-flex" style={{ marginBottom: '10px' }}>
            <div style={{ marginRight: '20px' }}>
              <Button
                variant={menunames[0].done ? 'success' : 'primary'}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  handleShow();
                }}
              >
                ファイル
              </Button>
            </div>
            <DropdownButton
              as={ButtonGroup}
              key="Success"
              id="dropdown-variants-Success"
              variant={menunames[6].done ? 'success' : 'primary'}
              title={menunames[6].name}
            >
              <Dropdown.Item eventKey="1" onClick={() => onProcessAuto(2)}>
                2×2
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={() => onProcessAuto(4)}>
                4×4
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <ul className="coias-ul" style={{ marginLeft: '110px' }}>
            {menunames.map((item) => {
              if (item.id === 1 || item.name === '全自動処理') {
                return null;
              }
              if (item.name === 'ビニングマスク') {
                return (
                  <li
                    key={item.id}
                    style={{ display: 'flex' }}
                    className="coias-li"
                  >
                    <div>
                      <DropdownButton
                        as={ButtonGroup}
                        variant={item.done ? 'success' : 'primary'}
                        title={item.name}
                      >
                        <Dropdown.Item
                          eventKey="1"
                          onClick={() => onProcess(`${item.query}2`)}
                        >
                          2×2
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="2"
                          onClick={() => onProcess(`${item.query}4`)}
                        >
                          4×4
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>
                    <div>
                      <AiOutlineArrowRight size={24} />
                    </div>
                  </li>
                );
              }
              if (item.name === '自動検出') {
                return (
                  <li key={item.id} className="coias-li">
                    <Button
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => {
                        onProcess(item.query);
                      }}
                      variant={item.done ? 'success' : 'primary'}
                    >
                      {item.name}
                    </Button>
                  </li>
                );
              }
              return (
                <li
                  key={item.id}
                  style={{ display: 'flex' }}
                  className="coias-li"
                >
                  <div>
                    <Button
                      id={item.query}
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => {
                        onProcess(item.query);
                      }}
                      variant={item.done ? 'success' : 'primary'}
                    >
                      {item.name}
                    </Button>
                  </div>
                  <div>
                    <AiOutlineArrowRight size={24} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Col>
      </Row>

      <Row
        xs="auto"
        style={{
          height: 'calc(100% - 96px)',
        }}
      >
        <Col>
          <h4>選択ファイル:</h4>
        </Col>
        <Col>
          <div
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '100%',
            }}
          >
            <ul style={{ listStyleType: 'none', color: 'white' }}>
              {fileNames.map((arr) => (
                <li key={arr}>{arr}</li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>

      <LoadingButton loading={loading} />

      <AppToast
        show={showError}
        title="エラー"
        closeCallback={() => setShowError(false)}
      />

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
    </div>
  );
}

export default ExplorePrepare;
