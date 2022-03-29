import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  Row,
  Col,
  DropdownButton,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import { AiOutlineArrowRight } from 'react-icons/ai';
import FileModal from '../component/FileModal';
import LoadingButton from '../component/LoadingButton';
import AppToast from '../component/AppToast/AppToast';

/**
 * 2022.03.24 y changed.
 * 全自動だけ段分け。
 */
function ExplorePrepare() {
  const menunames = [
    { id: 1, name: 'ファイル' },
    { id: 2, name: '事前処理', query: 'preprocess' },
    { id: 3, name: 'ビニングマスク', query: 'startsearch2R?binning=' },
    { id: 4, name: '軌道取得（確定番号）', query: 'prempsearchC-before' },
    { id: 5, name: '軌道取得（仮符号）', query: 'prempsearchC-after' },
    { id: 6, name: '光源検出', query: 'findsource' },
    { id: 7, name: '自動検出', query: 'astsearch_new' },
    { id: 8, name: '全自動処理', query: 'AstsearchR?binning=' },
  ];

  const uri = process.env.REACT_APP_API_URI;
  const [fileNames, setFileNames] = useState(['Please input files']);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const onProcess = (query) => {
    document.getElementById('current-process').innerHTML = '処理中...';
    const put = async () => {
      setLoading(true);
      await axios
        .put(uri + query)
        .then(() => setLoading(false))
        .catch(() => {
          setLoading(false);
          setShowError(true);
          document.getElementById('toast-message').innerHTML =
            '処理が失敗しました';
        });
    };
    if (query.length > 0) put();
  };

  /**
   * 処理の処理をまとめたモノ？
   *
   * @param {通信先} url
   * @param {処理名} processName
   * @returns
   */
  const onProcessExecute = async (url, processName) => {
    let result = true;
    document.getElementById('current-process').innerHTML = `${processName}...`;
    await axios.put(url).catch(() => {
      result = false;
      document.getElementById(
        'toast-message',
      ).innerHTML = `${processName}が失敗しました`;
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
    // 光源検出
    result = await onProcessExecute(`${uri}findsource`, '光源検出');
    if (!result) {
      return;
    }
    // 自動検出
    await onProcessExecute(`${uri}astsearch_new`, '自動検出');
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
              <FileModal
                fileNames={fileNames}
                setFileNames={setFileNames}
                onUploadStart={() => {
                  document.getElementById('current-process').innerHTML =
                    'アップロード中...';
                  setLoading(true);
                }}
                onUploadEnd={(result) => {
                  setLoading(false);
                  if (!result) {
                    document.getElementById('toast-message').innerHTML =
                      'ファイルアップロードが失敗しました';
                    setShowError(true);
                  }
                }}
              />
            </div>
            <DropdownButton
              as={ButtonGroup}
              key="Success"
              id="dropdown-variants-Success"
              variant="success"
              title={menunames[7].name}
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
                        key="Success"
                        id="dropdown-variants-Success"
                        variant="success"
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
                      variant="success"
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
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => {
                        onProcess(item.query);
                      }}
                      variant="success"
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
    </div>
  );
}

export default ExplorePrepare;
