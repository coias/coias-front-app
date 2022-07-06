import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Form, Button } from 'react-bootstrap';
import LoadingButton from '../component/LoadingButton';
import AppToast from '../component/AppToast';

function Report() {
  const reactApiUri = process.env.REACT_APP_API_URI;

  const [sendMpcOBS, setSendMpcOBS] = useState('');
  const [sendMpcMEA, setSendMpcMEA] = useState('');
  const [sendMpcBody, setSendMpcBody] = useState([]);
  const [sendMpc, setSendMpc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const makeSendMpc = async () => {
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

    await setSendMpc(header.concat(sendMpcBody));
  };

  const downloadFIle = () => {
    const element = document.createElement('a');
    const file = new Blob(
      sendMpc.map((item) => `${item}\n`),
      {
        type: 'text/plain',
      },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'send_mpc.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const getMpc = async () => {
    setLoading(true);
    await axios
      .put(`${reactApiUri}AstsearchR_afterReCOIAS`)
      .then((response) => {
        const mpctext = response.data.send_mpc;
        const result = mpctext.split('\n');
        setSendMpcBody(
          result.map((item) => {
            const trimedStr = item.trim();
            const splitStr = trimedStr.split(' ');
            if (splitStr[0].length >= 7) {
              return `\u00A0\u00A0\u00A0\u00A0\u00A0${trimedStr}`;
            }
            return trimedStr;
          }),
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setShowError(true);
        document.getElementById('toast-message').innerHTML =
          '処理が失敗しました。やり直してください。';
        setSendMpc('処理が失敗しました。やり直してください。');
      });
  };
  // 初回のみのAPIの読み込み
  useEffect(() => {
    getMpc();
  }, []);

  useEffect(() => {
    makeSendMpc();
  }, [sendMpcMEA, sendMpcOBS, sendMpcBody]);

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
                  downloadFIle();
                }}
              >
                Downlaod
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
          <div
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '70vh',
              overflow: 'scroll',
            }}
          >
            <ul id="send-mpc" style={{ listStyleType: 'none', color: 'white' }}>
              {sendMpc.length > 0 &&
                sendMpc.map((item) => <li key={item}>{item}</li>)}
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

export default Report;
