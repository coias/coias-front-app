import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useNavigate } from 'react-router-dom';
import {
  ModeStatusContext,
  UserIDContext,
} from '../component/functional/context';
import AlertModal from '../component/general/AlertModal';
import ErrorModal from '../component/general/ErrorModal';
import LoadingButton from '../component/general/LoadingButton';
import ThankYouModal from '../component/model/Report/ThankYouModal';

function Report({ setMenunames, setFileNames, setFileObservedTimes }) {
  const { userId } = useContext(UserIDContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const socketUrl = `${process.env.REACT_APP_WEB_SOCKET_URI}ws/${userId}`;

  const { lastJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    reconnectInterval: 3000,
  });

  const [sendMpcMEA, setSendMpcMEA] = useState('');
  const [sendMpcBody, setSendMpcBody] = useState([]);
  const [sendMpc, setSendMpc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');

  const [showProgress, setShowProgress] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const { modeStatus, setModeStatus } = useContext(ModeStatusContext);
  const [thankYouMessageBig, setThankYouMessageBig] = useState('');
  const [thankYouMessageSmall, setThankYouMessageSmall] = useState('');
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  };

  const makeSendMpc = async () => {
    const header = [
      'COD T09',
      'CON S. Urakawa, Bisei Spaceguard Center, 1716-3, Okura, Bisei',
      'CON Ibara, 714-1411 Okayama, Japan [urakawa@spaceguard.or.jp]',
      `OBS H. Aihara, Y. AlSayyad, M. Ando, R. Armstrong, J. Bosch, E. Egami,`,
      `H. Furusawa, J. Furusawa, S. Harasawa, Y. Harikane, B-H, Hsieh, H. Ikeda,`,
      `K. Ito, I. Iwata, T. Kodama, M. Koike, M. Kokubo, Y. Komiyama, X. Li, Y. Liang,`,
      `Y-T. Lin, R. H. Lupton, N. B. Lust, L. A. MacArthur, K. Mawatari, S. Mineo,`,
      `H. Miyatake, S. Miyazaki, S. More, T. Morishima, H. Murayama, K. Nakajima,`,
      `F. Nakata, A. J. Nishizawa, M. Oguri, N. Okabe, Y. Okura, Y. Ono, K. Osato,`,
      `M. Ouchi, Y-C. Pan, A. A. Plazas Malagón, P. A. Price, S. L. Reed,`,
      `E. S. Rykoff, T. Shibuya, M. Simunovic, M. A. Strauss, K. Sugimori, Y. Suto,`,
      `N. Suzuki, M. Takada, Y. Takagi, T. Takata, S. Takita, M. Tanaka, S. Tang,`,
      `D. S. Taranu, T. Terai, Y. Toba, E. L. Turner, H. Uchiyama,`,
      `B. Vijarnwannaluk, C. Z. Waters, Y. Yamada, N. Yamamoto, T. Yamashita`,
      `MEA ${sendMpcMEA}`,
      'TEL 8.2-m f/2.0 reflector + CCD(HSC)',
      'NET Pan-STARRS(PS1) DR1 catalog',
      'ACK Subaru/HSC',
    ];

    await setSendMpc(header.concat(sendMpcBody));
  };

  const downloadFIle = () => {
    if (sendMpcBody[0] === '') {
      setErrorPlace('sendMpcのダウンロード');
      setErrorReason('sendMpc.txtが空です');
      setShowProcessError(true);
      return;
    }
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
    setShowProgress(true);
    await axios
      .put(
        modeStatus.FinalCheck
          ? `${reactApiUri}get_mpc`
          : `${reactApiUri}AstsearchR_afterReCOIAS`,
        null,
        {
          params: { user_id: userId },
        },
      )
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
        setModeStatus((prevModeStatus) => {
          const modeStatusCopy = { ...prevModeStatus };
          modeStatusCopy.FinalCheck = true;
          return modeStatusCopy;
        });
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

  const downloadFinalAllFIle = async () => {
    await axios
      .get(`${reactApiUri}final_all?user_id=${userId}`)
      .then((response) => response.data.finalall)
      .then((finalall) => {
        const finalAllArray = finalall.split('\n');
        const element = document.createElement('a');
        const file = new Blob(
          finalAllArray.map((content) => `${content}\n`),
          {
            type: 'text/plain',
          },
        );
        element.href = URL.createObjectURL(file);
        element.download = 'final_all.txt';
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .catch(() => {
        setLoading(false);
        setShowError(true);
        setErrorMessage('final_all.txtがありません');
      });
  };

  // 初回のみのAPIの読み込み
  useEffect(() => {
    getMpc();
  }, []);

  useEffect(() => {
    makeSendMpc();
  }, [sendMpcMEA, sendMpcBody]);

  return (
    <div className="report-wrap">
      <Row xs="auto" className="report-wrap_form">
        <Col>
          <h4 className="f-modal_title f-ja">測定者名 </h4>
        </Col>
        <Col md={8}>
          <Form.Control
            style={{ textOverflow: 'ellipsis' }}
            placeholder="測定者(ご自身)のお名前を記入してください. 複数の場合はカンマ区切りで記入. (例) Y. Endo, M. Konohata, A. Manaka"
            onChange={(e) => {
              setSendMpcMEA(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row xs="auto">
        <Col>
          <h4 className="f-modal_title f-ja">レポート </h4>
        </Col>
        <Col md={8}>
          <div
            style={{
              width: '100%',
              backgroundColor: 'black',
              height: '61vh',
              overflow: 'scroll',
            }}
          >
            <ul id="send-mpc" style={{ listStyleType: 'none', color: 'white' }}>
              {sendMpc.length > 0 &&
                sendMpc.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="report-btn_wrap">
            <Button
              variant="primary"
              onClick={() => {
                getMpc();
              }}
              className="btn-style box_blue f-ja"
            >
              レポート作成をやり直す
            </Button>
            <div className="btn_wrap-content">
              <span className="f-ja">ファイルをダウンロード</span>
              <Button
                variant="primary"
                onClick={() => {
                  downloadFIle();
                  downloadFinalAllFIle();
                }}
                className="btn-style box_blue"
                disabled={!modeStatus.FinalCheck}
              >
                send_mpc.txt and final_all.txt
              </Button>
            </div>
          </div>
          <div className="report-btn_wrap">
            <Button
              variant="primary"
              onClick={async () => {
                const pattern = /[A-Z]. [A-Z][a-z]*/;
                const nameSplittedList = sendMpcMEA.split(',');
                let wrongNamePattern = false;
                nameSplittedList.forEach((name) => {
                  if (!pattern.test(name)) wrongNamePattern = true;
                });
                if (sendMpcBody[0] === '') {
                  setErrorMessage(
                    '報告できる測定結果が無いためメール送信の必要がありません。\n探索・手動測定モードに戻って有効な新天体を見つけるか、「探索終了」ボタンを押して別の画像を測定してください。',
                  );
                  setShowError(true);
                } else if (nameSplittedList[0] === '') {
                  setErrorMessage(
                    'MEA欄に1人以上の有効な名前を入力してください。\n(例) Y. Endo, M. Konohata, A. Manaka',
                  );
                  setShowError(true);
                } else if (wrongNamePattern) {
                  setErrorMessage(
                    'MEA欄に有効な書式の名前を入力してください。\n有効な書式: [名前の頭文字大文字]. [苗字を頭文字だけ大文字]\n全て半角英字\n名前と名字の間にはピリオドと半角スペースを入力\n複数の場合はカンマで並べる\n(例) Y. Endo, M. Konohata, A. Manaka',
                  );
                  setShowError(true);
                } else {
                  // K.S. ここでのエラーハンドリングはしない (エラーは意図的に握り潰しています)
                  await axios
                    .put(`${reactApiUri}postprocess`, sendMpc, {
                      params: { user_id: userId },
                    })
                    .catch(() => {});

                  const measuredNameList = [];
                  sendMpcBody.forEach((line) => {
                    const name = line.split(' ')[0].replace('*', '').trim();
                    if (!measuredNameList.includes(name) && name.length !== 0)
                      measuredNameList.push(name);
                  });
                  const res = await axios
                    .get(`${reactApiUri}start_H_number?user_id=${userId}`)
                    .catch(() => {});
                  let startHNumber;
                  if (res !== undefined) {
                    startHNumber = res.data.result;
                  }
                  let NOldUnknownObjects = 0;
                  let NNewUnknownObjects = 0;
                  let NKnownObjects = 0;
                  measuredNameList.forEach((name) => {
                    if (name.length === 7 && name.startsWith('H')) {
                      if (startHNumber !== undefined) {
                        const thisHNumber = parseInt(name.slice(1), 10);
                        if (thisHNumber >= startHNumber) {
                          NNewUnknownObjects += 1;
                        } else {
                          NOldUnknownObjects += 1;
                        }
                      } else {
                        NNewUnknownObjects += 1;
                      }
                    } else {
                      NKnownObjects += 1;
                    }
                  });
                  let bigMessage = 'あなたは';
                  if (NOldUnknownObjects + NNewUnknownObjects !== 0) {
                    bigMessage = bigMessage.concat(
                      `${
                        NOldUnknownObjects + NNewUnknownObjects
                      }個の新天体候補`,
                    );
                    if (NKnownObjects !== 0) {
                      bigMessage = bigMessage.concat('と');
                    }
                  }
                  if (NKnownObjects !== 0) {
                    bigMessage = bigMessage.concat(
                      `${NKnownObjects}個の既知天体`,
                    );
                  }
                  bigMessage = bigMessage.concat('をMPCに報告しました!\n');

                  const res2 = await axios
                    .get(`${reactApiUri}N_new_objects`)
                    .catch(() => {});
                  let smallMessage = '';
                  if (res2 !== undefined && NNewUnknownObjects !== 0) {
                    const NTotalNewObjects = res2.data.result;
                    smallMessage = `COIASで発見された新天体候補は合計${NTotalNewObjects}個になりました。\n`;
                  }

                  setThankYouMessageBig(bigMessage);
                  setThankYouMessageSmall(smallMessage);
                  setShowThankYouModal(true);
                }
              }}
              className="btn-style box_blue"
              disabled={!modeStatus.FinalCheck}
            >
              確認完了・メール送信
            </Button>
          </div>
        </Col>
      </Row>
      <LoadingButton
        loading={loading}
        processName="レポートデータ取得中…"
        showProgress={showProgress}
        lastJsonMessage={lastJsonMessage}
      />

      <ThankYouModal
        thankYouModalShow={showThankYouModal}
        onClickOk={() => {
          setFileNames(['ファイルを選択してください']);
          setFileObservedTimes([]);
          setModeStatus({
            ExplorePrepare: false,
            COIAS: false,
            Manual: false,
            Report: false,
            FinalCheck: false,
          });
          handleNavigate();
          setMenunames((prevMenunames) =>
            prevMenunames.map((items) => {
              const objCopy = { ...items };
              objCopy.done = false;
              return objCopy;
            }),
          );
          setShowThankYouModal(false);
        }}
        thankYouMessageBig={thankYouMessageBig}
        thankYouMessageSmall={thankYouMessageSmall}
      />

      <AlertModal
        alertModalShow={showError}
        onClickOk={() => {
          setShowError(false);
        }}
        alertMessage={errorMessage}
        alertButtonMessage="OK"
        size="md"
      />

      <ErrorModal
        show={showProcessError}
        setShow={setShowProcessError}
        errorPlace={errorPlace}
        errorReason={errorReason}
        setLoading={setLoading}
      />
    </div>
  );
}

export default Report;

Report.propTypes = {
  setMenunames: PropTypes.func.isRequired,
  setFileNames: PropTypes.func.isRequired,
  setFileObservedTimes: PropTypes.func.isRequired,
};
