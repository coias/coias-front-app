import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';

function Report() {
  const reactApiUri = process.env.REACT_APP_API_URI;

  const [sendMpcOBS, setSendMpcOBS] = useState('');
  const [sendMpcMEA, setSendMpcMEA] = useState('');
  const [sendMpcBody, setSendMpcBody] = useState([]);
  const [sendMpc, setSendMpc] = useState([]);

  const makeSendMpc = () => {
    const header = [
      'COD 568',
      'CON S. Urakawa, Bisei Spaceguard Center, 1716-3, Okura, Bisei',
      'CON Ibara, 714-1411 Okayama, Japan [urakawa@spaceguard.or.jp]',
      `OBS ${sendMpcOBS}`,
      `MEA ${sendMpcMEA}`,
      'TEL 8.2-m f/2.0 reflector + CCD(HSC)',
      'NET Pan-STARRS(PS1) DR1 catalog',
      'ACK Subaru/HSC',
    ];

    setSendMpc(header.concat(sendMpcBody));
  };

  const getMpc = async () => {
    const response = await axios.put(`${reactApiUri}AstsearchR_afterReCOIAS`);
    const mpctext = await response.data.send_mpc;
    const re = /((?!(H|K))(.*))/g;
    const result = mpctext.split(re);
    setSendMpcBody(result);
  };
  // 初回のみのAPIの読み込み
  useMemo(() => {
    getMpc();
  }, []);

  return (
    <div>
      <Form>
        <Form.Group className="p-3 w-75">
          <Row xs="auto">
            <Col md={1}>
              <h4>OBS:</h4>
            </Col>
            <Col md={10}>
              <Form.Control
                placeholder="複数の場合は空白区切りで入力してください"
                onChange={(e) => {
                  setSendMpcOBS(e.target.value);
                }}
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="p-3 w-75">
          <Row xs="auto">
            <Col md={1}>
              <h4>MEA:</h4>
            </Col>
            <Col md={10}>
              <Form.Control
                placeholder="複数の場合は空白区切りで入力してください"
                onChange={(e) => {
                  setSendMpcMEA(e.target.value);
                }}
              />
            </Col>
            <Col md={1}>
              <Button
                variant="primary"
                onClick={() => {
                  makeSendMpc();
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
      <Row xs="auto">
        <Col>
          <h4>レポート:</h4>
        </Col>
        <Col>
          <Scrollbars
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '1000px',
            }}
          >
            <div
              style={{
                backgroundColor: 'black',
                width: '1000px',
                height: '1000px',
              }}
            >
              <ul style={{ listStyleType: 'none', color: 'white' }}>
                {sendMpc.map((arr) => (
                  <li key={arr}>{arr}</li>
                ))}
              </ul>
            </div>
          </Scrollbars>
        </Col>
      </Row>
    </div>
  );
}

export default Report;
