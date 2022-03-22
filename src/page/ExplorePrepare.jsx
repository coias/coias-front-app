import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  DropdownButton,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import FileModal from '../component/FileModal';

function ExplorePrepare() {
  const menunames = [
    { id: 1, name: 'ファイル' },
    { id: 2, name: '事前処理', query: 'preprocess' },
    { id: 3, name: 'ビニングマスク', query: 'startsearch2R?binning=' },
    // { id: 4, name: '軌道取得（確定番号）', query: 'prempsearchC1' },
    // { id: 5, name: '軌道取得（仮符号）', query: 'prempsearchC2' },
    { id: 4, name: '軌道取得', query: 'prempsearchC' },
    { id: 5, name: '光源検出', query: 'findsource' },
    { id: 6, name: '自動検出', query: 'astsearch_new' },
    { id: 7, name: '全自動処理', query: 'AstsearchR?binning=' },
  ];

  const uri = process.env.REACT_APP_API_URI;
  const [fileNames, setFileNames] = useState(['Please input files']);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const put = async () => {
      if (query.startsWith('startsearch2R?binning='))
        await axios.put(`${uri}preprocess`);
      await axios.put(uri + query);
    };
    if (query.length > 0) put();
  }, [query]);

  return (
    <div>
      <Row xs="auto">
        <Col>
          <h4>探索準備 : </h4>
        </Col>
        <Col>
          <ul className="coias-ul">
            {menunames.map((item) => {
              if (item.id === 1) {
                return (
                  <li key={item.id} className="coias-li">
                    <FileModal
                      fileNames={fileNames}
                      setFileNames={setFileNames}
                    />
                  </li>
                );
              }
              if (
                item.name === 'ビニングマスク' ||
                item.name === '全自動処理'
              ) {
                return (
                  <li key={item.id} className="coias-li">
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
                  </li>
                );
              }
              return (
                <li key={item.id} className="coias-li">
                  <Button
                    onClick={() => {
                      setQuery(item.query);
                    }}
                    variant="success"
                  >
                    {item.name}
                  </Button>
                </li>
              );
            })}
          </ul>
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
    </div>
  );
}

export default ExplorePrepare;
