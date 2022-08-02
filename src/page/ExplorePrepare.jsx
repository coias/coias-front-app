/*
 * 探索準備モード
 *
 */
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
import PropTypes from 'prop-types';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import LoadingButton from '../component/LoadingButton';
import AppToast from '../component/AppToast';
import ErrorModal from '../component/ErrorModal';
// import ExcuteButton from '../component/ExcuteButton';

// eslint-disable-next-line no-use-before-define
ExplorePrepare.propTypes = {
  fileNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFileNames: PropTypes.func.isRequired,
  menunames: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMenunames: PropTypes.func.isRequired,
  val: PropTypes.string.isRequired,
  setVal: PropTypes.func.isRequired,
};

/**
 * 2022.03.24 y changed.
 * 全自動だけ段分け。
 *
 */
function ExplorePrepare({
  fileNames,
  setFileNames,
  menunames,
  setMenunames,
  val,
  setVal,
}) {
  const uri = process.env.REACT_APP_API_URI;
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const fileInput = useRef();
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [errorContent, setErrorContent] = useState('');
  const [processName, setProcessName] = useState('');
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [errorFiles, setErrorFile] = useState([]);

  const handleSelect = (e) => setVal(e.target.value);

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

  const updateMenunames = () => {
    setMenunames((prevMenunames) =>
      prevMenunames.map((items) =>
        items.done === true
          ? {
              id: items.id,
              name: items.name,
              query: items.query,
              done: false,
            }
          : items,
      ),
    );
    setMenunames((prevMenunames) =>
      prevMenunames.map((items) =>
        items.id === 1
          ? { id: items.id, name: items.name, query: items.query, done: true }
          : items,
      ),
    );
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
    setErrorFile([]);

    let file;
    let tmp;

    const pattern =
      /warp-HSC-.*-([0-9]{1,4})-([0-9]),([0-9])-([0-9]{1,6}).fits/gm;

    const errorFileNames = [];

    if (files.length < 3)
      errorFileNames.push('ファイルが足りません。3つ以上選択してください。');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      const result = file.name.match(pattern);
      const isMatch = result && result.length === 1 && result[0] === file.name;
      if (i === 0 && isMatch) {
        const a = file.name.split(`-`);
        tmp = `${a[3]}${a[4]}`;
      } else if (i > 0 && isMatch) {
        const b = file.name.split(`-`);
        const isSame = tmp === `${b[3]}${b[4]}`;
        if (!isSame) {
          errorFileNames.push(`${file.name}は観測領域が異なります`);
        }
      }

      if (!isMatch) {
        errorFileNames.push(`${file.name}のファイル名の形式が違います`);
      }

      data.append('files', file, file.name);
      filesForProps.push(file.name);
      setErrorContent(``);
    }

    setErrorFile(errorFileNames);

    const postFiles = async () => {
      handleClose();
      setProcessName('アップロード中...');

      setLoading(true);
      await axios.delete(`${uri}deletefiles`);
      await axios
        .post(`${uri}uploadfiles/`, data)
        .then(() => {
          updateMenunames();
          setLoading(false);
        })
        .catch(() => {
          setShowProcessError(true);
          setErrorPlace('ファイルアップロード');
          setErrorReason('ファイルアップロードに失敗しました');
          setLoading(false);
        });
    };

    if (errorFileNames.length === 0) {
      setFileNames(filesForProps);
      postFiles();
    }
    return null;
  };

  const onProcess = (query) => {
    setProcessName('処理中...');
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
        .catch((e) => {
          const errorResponse = e.response?.data?.detail;
          if (errorResponse.place) {
            setErrorPlace(errorResponse.place);
            setErrorReason(errorResponse.reason);
            setShowProcessError(true);
          }
          setLoading(false);
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
    setProcessName(`${query}...`);
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
      .catch((e) => {
        const errorResponse = e.response?.data?.detail;
        if (errorResponse.place) {
          setErrorPlace(errorResponse.place);
          setErrorReason(errorResponse.reason);
          setShowProcessError(true);
        }
        result = false;
        setLoading(false);
      });
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
    // ビニングマスク（size: 2 or 4）自動の時は2で固定
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

    const items = [...menunames];
    const item = { ...items[6] };
    item.done = true;
    items[6] = item;
    setMenunames(items);
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: '40px',
        height: '100%',
      }}
    >
      <Row>
        <Col md={2}>
          <Row style={{ marginBottom: '40px' }}>
            <h4>探索準備</h4>
          </Row>
          <Row style={{ marginBottom: '40px' }}>
            <h4>選択ファイル</h4>
          </Row>
        </Col>
        <Col md={10}>
          <Row xs="auto" style={{ marginBottom: '40px' }}>
            <Col style={{ margin: 'auto 0' }}>
              <Button
                variant={menunames[0].done ? 'success' : 'primary'}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  handleShow();
                }}
              >
                ファイル
              </Button>
            </Col>
            {val === 'auto' ? (
              <Col style={{ margin: 'auto 0' }}>
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
              </Col>
            ) : (
              <>
                <Col style={{ paddingRight: 0 }}>
                  <Button
                    id={menunames[1].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[1].query);
                    }}
                    variant={menunames[1].done ? 'success' : 'primary'}
                  >
                    {menunames[1].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <DropdownButton
                    as={ButtonGroup}
                    variant={menunames[2].done ? 'success' : 'primary'}
                    title={menunames[2].name}
                  >
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() => onProcess(`${menunames[2].query}2`)}
                    >
                      2×2
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="2"
                      onClick={() => onProcess(`${menunames[2].query}4`)}
                    >
                      4×4
                    </Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[3].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[3].query);
                    }}
                    variant={menunames[3].done ? 'success' : 'primary'}
                  >
                    {menunames[3].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[4].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[4].query);
                    }}
                    variant={menunames[4].done ? 'success' : 'primary'}
                  >
                    {menunames[4].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[5].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[5].query);
                    }}
                    variant={menunames[5].done ? 'success' : 'primary'}
                  >
                    {menunames[5].name}
                  </Button>
                </Col>
              </>
            )}
          </Row>
          <Row>
            <Col style={{ margin: 'auto 0' }}>
              <div
                style={{
                  backgroundColor: 'black',
                  width: '70vw',
                  height: '500px',
                  border: '3px solid #282A7F',
                  borderRadius: '4px',
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
        </Col>
      </Row>
      <LoadingButton loading={loading} processName={processName} />
      <AppToast
        show={showError}
        title="エラー"
        content={errorContent}
        closeCallback={() => setShowError(false)}
      />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>ファイルを選択してください</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="mx-3">
            アップロード後、画像処理をおこないます。
            <br />
            処理は時間がかかります。
            <br />
            画像処理は全自動処理と手動処理が選択できます。
            <InputGroup hasValidation className="mt-3">
              <Row>
                <Form.Control
                  type="file"
                  ref={fileInput}
                  onChange={handleChange}
                  isInvalid={valid}
                  multiple
                  className="mx-2"
                />
              </Row>
              <Row>
                {errorFiles.map((element) => (
                  <p
                    style={{
                      color: element.startsWith('') && 'red',
                    }}
                  >
                    {element}
                  </p>
                ))}
              </Row>
            </InputGroup>
            <Form.Check
              className="mt-3"
              inline
              type="radio"
              label="全自動処理"
              name="group1"
              id="auto"
              value="auto"
              onChange={handleSelect}
              checked={val === 'auto'}
            />
            <Form.Check
              className="mt-3"
              inline
              type="radio"
              label="手動処理"
              name="group1"
              id="manual"
              value="manual"
              onChange={handleSelect}
              checked={val === 'manual'}
            />
            <Button
              onClick={async () => {
                handleClose();
                await axios
                  .put(`${uri}getMPCORB_and_mpc2edb`)
                  .then(() => {
                    setProcessName('小惑星データ更新中...');
                    setLoading(true);
                  })
                  .catch((e) => {
                    const errorResponse = e.response?.data?.detail;
                    if (errorResponse.place) {
                      setErrorPlace(errorResponse.place);
                      setErrorReason(errorResponse.reason);
                      setShowProcessError(true);
                    }
                  });
                setLoading(false);
              }}
            >
              小惑星データ更新
            </Button>
            <Form.Control.Feedback type="invalid">
              ファイルを選択してください。
            </Form.Control.Feedback>
          </Modal.Body>

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
      <ErrorModal
        show={showProcessError}
        setShow={setShowProcessError}
        errorPlace={errorPlace}
        errorReason={errorReason}
      />
    </div>
  );
}

export default ExplorePrepare;
