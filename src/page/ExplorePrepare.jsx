import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Spinner,
} from 'react-bootstrap';
import { AiOutlineArrowRight } from 'react-icons/ai';
import FileModal from '../component/FileModal';

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
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, [query]);

  return (
    <div style={{}}>
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
                        onUploadStart={() => setLoading(true)}
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
                            setQuery(`${item.query}2`);
                          }}
                        >
                          2×2
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="2"
                          onClick={() => {
                            setQuery(`${item.query}4`);
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
                        setQuery(item.query);
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
                        setQuery(item.query);
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
          <br />
          <br />
          <div key={menunames[7].id}>
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
                  setQuery(`${menunames[7].query}2`);
                }}
              >
                2×2
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={() => {
                  setQuery(`${menunames[7].query}4`);
                }}
              >
                4×4
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </Col>
      </Row>

      <Row xs="auto">
        <Col>
          <h4>選択ファイル:</h4>
        </Col>
        <Col>
          <div
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '1000px',
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

      {loading && (
        <Button
          type="button"
          style={{
            width: '100%',
            height: '100vh',
            position: 'fixed',
            zIndex: 100,
            backgroundColor: '#0000004f',
            top: 0,
            left: 0,
          }}
        >
          <Spinner
            animation="border"
            style={{
              width: '50px',
              height: '50px',
            }}
          />
          <div>処理中...</div>
        </Button>
      )}
    </div>
  );
}

export default ExplorePrepare;
