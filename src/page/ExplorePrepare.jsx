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

  const onProcess = (query) => {
    document.getElementById('current-process').innerHTML = '処理中...';
    const put = async () => {
      setLoading(true);
      if (query.startsWith('startsearch2R?binning='))
        await axios.put(`${uri}preprocess`);
      await axios
        .put(uri + query)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    };
    if (query.length > 0) put();
  };

  const onProcessAuto = async (size) => {
    // 事前処理
    setLoading(true);
    let result = true;
    document.getElementById('current-process').innerHTML = '事前処理...';
    await axios.put(`${uri}preprocess`).catch(() => {
      result = false;
    });
    if (!result) {
      setLoading(false);
      return;
    }
    // ビギニングマスク（size: 2 or 4）
    let beginingMask;
    if (size === 2) {
      beginingMask = '2x2';
    } else {
      beginingMask = '4x4';
    }
    document.getElementById(
      'current-process',
    ).innerHTML = `ビギニングマスク（${beginingMask}）...`;
    await axios.put(`${uri}startsearch2R?binning=${size}`).catch(() => {
      result = false;
    });
    if (!result) {
      setLoading(false);
      return;
    }
    // 軌道取得（確定番号）
    document.getElementById('current-process').innerHTML =
      '軌道取得（確定番号）...';
    await axios.put(`${uri}prempsearchC-before`).catch(() => {
      result = false;
    });
    if (!result) {
      setLoading(false);
      return;
    }
    // 軌道取得（仮符号）
    document.getElementById('current-process').innerHTML =
      '軌道取得（仮符号）...';
    await axios.put(`${uri}prempsearchC-after`).catch(() => {
      result = false;
    });
    if (!result) {
      setLoading(false);
      return;
    }
    // 光源検出
    document.getElementById('current-process').innerHTML = '光源検出...';
    await axios.put(`${uri}findsource`).catch(() => {
      result = false;
    });
    if (!result) {
      setLoading(false);
      return;
    }
    // 自動検出
    document.getElementById('current-process').innerHTML = '自動検出...';
    await axios.put(`${uri}astsearch_new`).catch(() => {
      result = false;
    });
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
          <ul className="coias-ul">
            {menunames.map((item) => {
              if (item.id === 1) {
                return (
                  <li
                    key={item.id}
                    style={{ display: 'flex' }}
                    className="coias-li"
                  >
                    <div>
                      <FileModal
                        fileNames={fileNames}
                        setFileNames={setFileNames}
                        onUploadStart={() => {
                          document.getElementById('current-process').innerHTML =
                            'アップロード中...';
                          setLoading(true);
                        }}
                        onUploadEnd={() => setLoading(false)}
                      />
                    </div>
                    <div>
                      <AiOutlineArrowRight size={24} />
                    </div>
                  </li>
                );
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
                          onClick={() => {
                            onProcess(`${item.query}2`);
                          }}
                        >
                          2×2
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="2"
                          onClick={() => {
                            onProcess(`${item.query}4`);
                          }}
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
              if (item.name === '全自動処理') {
                return null;
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
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            <DropdownButton
              as={ButtonGroup}
              key="Success"
              id="dropdown-variants-Success"
              variant="success"
              title={menunames[7].name}
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() => {
                  // onProcess(`${menunames[7].query}2`);
                  onProcessAuto(2);
                }}
              >
                2×2
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={() => {
                  // onProcess(`${menunames[7].query}4`);
                  onProcessAuto(4);
                }}
              >
                4×4
              </Dropdown.Item>
            </DropdownButton>
          </div>
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
    </div>
  );
}

export default ExplorePrepare;
