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
import { AiOutlineArrowRight } from 'react-icons/ai';
import LoadingButton from '../component/LoadingButton';
import AppToast from '../component/AppToast';
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

  const handleSelect = (e) => setVal(e.target.value);

  const DEFAULT_FILE_NUM = 5;

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

    if (DEFAULT_FILE_NUM !== files.length) {
      setErrorContent(`${DEFAULT_FILE_NUM}枚の画像を入力してください`);
      setShowError(true);
      handleClose();
      return null;
    }

    let file;
    let tmp;

    const pattern =
      /warp-HSC-([0-9]|[A-Z]){1,2}-([0-9]{1,4})-([0-9]),([0-9])-([0-9]{1,6}).fits/gm;

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
          setErrorContent(`${file.name}は観測領域が異なります`);
          setShowError(true);
          handleClose();
          return null;
        }
      }

      if (!isMatch) {
        setErrorContent(`${file.name}のファイル名の形式が違います`);
        setShowError(true);
        handleClose();
        return null;
      }
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
          updateMenunames();
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
    return null;
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
        padding: '20px',
        height: '100%',
      }}
    >
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Row xs="auto">
          <Col>
            <h4>探索準備 : </h4>
          </Col>
          <Row>
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
                <Col style={{ padding: 0, paddingLeft: 20 }}>
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
                  <AiOutlineArrowRight size={24} />
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
                  <AiOutlineArrowRight size={24} />
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
                  <AiOutlineArrowRight size={24} />
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
                  <AiOutlineArrowRight size={24} />
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
        </Row>
      </div>

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
        content={errorContent}
        closeCallback={() => setShowError(false)}
      />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            ファイルを{DEFAULT_FILE_NUM}個選択してください
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          アップロード後、画像処理をおこないます。
          <br />
          処理は時間がかかります。
          <br />
          画像処理は全自動処理と手動処理が選択できます。
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
              ファイルを選択してください。ファイルは{DEFAULT_FILE_NUM}
              個選択できます。
            </Form.Control.Feedback>
          </InputGroup>
          <Form.Check
            className="m-3"
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
            className="m-3"
            inline
            type="radio"
            label="手動処理"
            name="group1"
            id="manual"
            value="manual"
            onChange={handleSelect}
            checked={val === 'manual'}
          />
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
