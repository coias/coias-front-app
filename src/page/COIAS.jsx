import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ModeStatusContext,
  PageContext,
  StarPositionContext,
  PredictedStarPositionContext,
  UserIDContext,
} from '../component/functional/context';
import AlertModal from '../component/general/AlertModal';
import ErrorModal from '../component/general/ErrorModal';
import LoadingButton from '../component/general/LoadingButton';
import PanZoom from '../component/model/MeasurementCommon/PanZoom';
import PlayMenu from '../component/model/MeasurementCommon/PlayMenu';
import StarsList from '../component/model/MeasurementCommon/StarsList';
import useEventListener from '../hooks/useEventListener';

// eslint-disable-next-line no-use-before-define
COIAS.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  subImageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSubImageURLs: PropTypes.func.isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  setOriginalStarPos: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
  next: PropTypes.bool.isRequired,
  setNext: PropTypes.func.isRequired,
  back: PropTypes.bool.isRequired,
  setBack: PropTypes.func.isRequired,
  setting: PropTypes.bool.isRequired,
  setSetting: PropTypes.func.isRequired,
  zoomIn: PropTypes.bool.isRequired,
  setZoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.bool.isRequired,
  setZoomOut: PropTypes.func.isRequired,
};

function COIAS({
  imageURLs,
  setImageURLs,
  subImageURLs,
  setSubImageURLs,
  originalStarPos,
  setOriginalStarPos,
  intervalRef,
  start,
  setStart,
  next,
  setNext,
  back,
  setBack,
  setting,
  setSetting,
  zoomIn,
  setZoomIn,
  zoomOut,
  setZoomOut,
}) {
  const [isHide, setIsHide] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [loading, setLoading] = useState(false);
  const [redispLoading, setRedispLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [fileNum, setFileNum] = useState(0);
  const [memoList, setMemoList] = useState([]);
  const [selectedListState, setSelectedListState] = useState([]);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [COIASAlertModalshow, setCOIASAlertModalshow] = useState(false);
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtonMessage, setAlertButtonMessage] = useState('');
  const wrapperRef = useRef(null);
  const [validImages, setValidImages] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const navigate = useNavigate();

  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { setPredictedStarPos } = useContext(PredictedStarPositionContext);
  const { setCurrentPage } = useContext(PageContext);
  const { setModeStatus } = useContext(ModeStatusContext);
  const { userId } = useContext(UserIDContext);

  // ズーム時に使用する状態管理配列
  const [scaleArray, setScaleArray] = useState(
    Array(39)
      .fill({ id: null, done: null })
      .map((_, index) => {
        let element = {};
        if (index === 0) {
          element = { id: 1, done: true };
        } else {
          element = { id: 1 + 0.5 * index, done: false };
        }
        return element;
      }),
  );

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
  useEffect(() => {
    const toObjectArray = [];
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
    // nginxにある画像を全て取得
    const getImages = async () => {
      setLoading(true);
      const response = await axios.put(`${reactApiUri}copy`, null, {
        params: { user_id: userId },
      });
      const dataList = await response.data.result.sort();
      if (dataList.length === 0) {
        setCOIASAlertModalshow(true);
        setAlertMessage('ビニングマスクを行ってください');
        setAlertButtonMessage('探索準備に戻る');
      }

      const fileNumbers = dataList.length / 2;
      setFileNum(fileNumbers);

      await dataList.forEach((data) => {
        const idx = data.slice(0, 2);
        const o =
          toObjectArray.filter((obj) => obj.name.startsWith(idx))[0] ?? {};
        if (toObjectArray.indexOf(o) === -1) {
          toObjectArray.push(o);
        }
        if (data.endsWith('disp-coias.png')) {
          o.name = data;
          o.mask = nginxApiUri + data;
        } else {
          o.nomask = nginxApiUri + data;
        }
        o.visible = true;
        o.nomasked = false;
      });
      setImageURLs(toObjectArray);
      setSubImageURLs(toObjectArray);
      setLoading(false);

      await axios
        .get(`${reactApiUri}time_list?user_id=${userId}`)
        .then((res) => res.data.result)
        .then((tmpTimeList) => {
          if (tmpTimeList.length === fileNumbers) {
            setTimeList(tmpTimeList);
          }
        })
        .catch(() => {});
    };
    const getMemo = async () => {
      await axios
        .get(`${reactApiUri}memo?user_id=${userId}`)
        .then((res) => setMemoList(res.data.memo))
        .catch((e) => {
          console.error(e);
        });
    };

    getImages();
    getMemo();
    setModeStatus({
      ExplorePrepare: true,
      COIAS: true,
      Manual: false,
      Report: false,
      FinalCheck: false,
    });
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
    // unknown_disp.txtを取得
    const getDisp = async () => {
      setLoading(true);

      const toObject = {};

      const res1 = await axios
        .get(`${reactApiUri}unknown_disp?user_id=${userId}`)
        .catch(() => {
          setCOIASAlertModalshow(true);
          setAlertMessage('自動検出を行ってください');
          setAlertButtonMessage('探索準備に戻る');
        });
      if (res1 !== undefined) {
        const knownDisp = await res1.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: memoList.find(
                (memoName) => memoName === item[0].replace('H', ''),
              ),
              isKnown: false,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
      }

      const res2 = await axios
        .get(`${reactApiUri}karifugo_disp?user_id=${userId}`)
        .catch(() => {});
      const res3 = await axios
        .get(`${reactApiUri}numbered_disp?user_id=${userId}`)
        .catch(() => {});
      if (res2 !== undefined) {
        const knownDisp = await res2.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: false,
              isKnown: true,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
      }
      if (res3 !== undefined) {
        const knownDisp = await res3.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: false,
              isKnown: true,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
      }

      const toPredictedObject = {};

      const res4 = await axios
        .get(`${reactApiUri}predicted_disp?user_id=${userId}`)
        .catch(() => {});
      if (res4 !== undefined) {
        const predictedDisp = await res4.data.result;
        predictedDisp.forEach((item) => {
          let star = toPredictedObject[item[0]];
          if (!star) {
            toPredictedObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: false,
              isKnown: !(item[0].startsWith('H') && item[0].length === 7),
            };
            star = toPredictedObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
            isPredict: item[4] === '0',
          };
        });
      }

      setSelectedListState(
        Object.values(toObject).map((star) => {
          if (star.isSelected) {
            return true;
          }
          return false;
        }),
      );
      setStarPos(toObject);
      setOriginalStarPos(toObject);
      setPredictedStarPos(toPredictedObject);
      setLoading(false);
    };
    setStarPos({});

    window.images = [];
    window.images = imageURLs.map((image) => {
      setLoading(true);
      const masked = new Image();
      const nomasked = new Image();
      const onLoad = () => {
        window.imageLoadComplete =
          window.images.filter(
            (i) =>
              i[0].complete &&
              i[0].naturalWidth !== 0 &&
              i[1].complete &&
              i[1].naturalWidth !== 0,
          ).length === window.images.length;
        if (window.imageLoadComplete && isAutoSave) {
          getDisp();
        }
      };
      masked.onload = onLoad;
      nomasked.onload = onLoad;
      masked.src = `${image.mask}?${new Date().getTime()}`;
      nomasked.src = `${image.nomask}?${new Date().getTime()}`;
      setLoading(false);

      return [masked, nomasked];
    });
    if (validImages.length !== 0) {
      setCurrentPage(validImages[0]);
    } else {
      setCurrentPage(0);
    }
  }, [imageURLs, memoList]);

  // 探索終了ボタンが押された時の処理
  const onClickFinishButton = async () => {
    setRedispLoading(true);

    // memo.txtへの出力
    const selectedStars = Object.keys(starPos)
      .map((key) => starPos[key])
      .filter((item) => item.isSelected)
      .map((item) => item.name.substring(1));
    await axios.put(`${reactApiUri}memo`, selectedStars, {
      params: { user_id: userId },
    });

    await axios
      .put(`${reactApiUri}AstsearchR_between_COIAS_and_ReCOIAS`, null, {
        params: { user_id: userId },
      })
      .then((response) => {
        const redisp = response.data;
        // 選択を同期させるため、オブジェクトに変更
        const toObject = {};
        redisp.forEach((item) => {
          if (item.length === 0) {
            return;
          }
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: false,
              isKnown: !(item[0].startsWith('H') && item[0].length === 7),
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });

        setStarPos(toObject);
        setModeStatus((prevModeStatus) => {
          const modeStatusCopy = { ...prevModeStatus };
          modeStatusCopy.Manual = true;
          modeStatusCopy.Report = true;
          return modeStatusCopy;
        });
        setRedispLoading(false);
      })
      .catch((e) => {
        const errorResponse = e.response?.data?.detail;
        if (errorResponse.place) {
          setErrorPlace(errorResponse.place);
          setErrorReason(errorResponse.reason);
          setShowProcessError(true);
          setRedispLoading(false);
        }
      });
  };

  const writeMemo = async (newStarPos) => {
    // memo.txtへの出力
    const selectedStars = Object.values(newStarPos)
      .filter((p) => p.isSelected)
      .map((e) => e.name.replace('H', ''));
    await axios.put(`${reactApiUri}memo`, selectedStars, {
      params: { user_id: userId },
    });
  };

  useEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === 's') {
      setStart(!start);
    } else if (e.key === 'ArrowRight') {
      setNext(!next);
    } else if (e.key === 'ArrowLeft') {
      setBack(!back);
    } else if (e.key === 'ArrowUp') {
      setZoomIn(!zoomIn);
    } else if (e.key === 'ArrowDown') {
      setZoomOut(!zoomOut);
    }
  });

  return (
    <div className="coias-view-main" id="wrapper-coias">
      <Row>
        <Col>
          <PlayMenu
            imageNames={imageURLs}
            intervalRef={intervalRef}
            start={start}
            next={next}
            setNext={setNext}
            back={back}
            setBack={setBack}
            disable={disable}
            setDisable={setDisable}
            originalStarPos={originalStarPos}
            setStarPos={setStarPos}
            fileNum={fileNum}
            isAutoSave={isAutoSave}
            setIsAutoSave={setIsAutoSave}
            setOriginalStarPos={setOriginalStarPos}
            validImages={validImages}
            setValidImages={setValidImages}
            subImageURLs={subImageURLs}
            setSetting={setSetting}
            scaleArray={scaleArray}
            setScaleArray={setScaleArray}
            zoomIn={zoomIn}
            setZoomIn={setZoomIn}
            zoomOut={zoomOut}
            setZoomOut={setZoomOut}
            wrapperRef={wrapperRef}
            isHide={isHide}
            setIsHide={setIsHide}
          />
          <Container fluid>
            <Row className="m-0 p-0">
              <Col>
                <PanZoom
                  imageURLs={imageURLs}
                  brightnessVal={brightnessVal}
                  contrastVal={contrastVal}
                  originalStarPos={originalStarPos}
                  starPos={starPos}
                  setStarPos={setStarPos}
                  isHide={isHide}
                  disable={disable}
                  setSelectedListState={setSelectedListState}
                  writeMemo={isAutoSave ? writeMemo : () => {}}
                  scaleArray={scaleArray}
                  wrapperRef={wrapperRef}
                  setting={setting}
                  setSetting={setSetting}
                  timeList={timeList}
                  setBrightnessVal={setBrightnessVal}
                  setContrastVal={setContrastVal}
                />
              </Col>
            </Row>
          </Container>
        </Col>
        <div
          className="coias-star-list-wrraper"
          style={{ display: 'flex', flexDirection: 'column', width: '200px' }}
        >
          <StarsList
            disable={disable}
            writeMemo={isAutoSave ? writeMemo : () => {}}
            selectedListState={selectedListState}
            setSelectedListState={setSelectedListState}
          />
          <div className="coias-list_button">
            {redispLoading ? (
              <Spinner size="md" animation="border" />
            ) : (
              <Button
                onClick={() => {
                  if (disable) {
                    setOriginalStarPos(starPos);
                    onClickFinishButton();
                  } else {
                    setStarPos(originalStarPos);
                    setModeStatus({
                      ExplorePrepare: true,
                      COIAS: true,
                      Manual: false,
                      Report: false,
                      FinalCheck: false,
                    });
                  }
                  setDisable(!disable);
                }}
                className="btn-style box_blue f-ja"
                size="lg"
              >
                {disable ? '再描画' : 'やり直す'}
              </Button>
            )}
          </div>
        </div>
      </Row>
      <LoadingButton loading={loading} processName="探索データ取得中…" />

      <AlertModal
        alertModalShow={COIASAlertModalshow}
        onClickOk={() => {
          navigate('/');
          setCOIASAlertModalshow(false);
        }}
        alertMessage={alertMessage}
        alertButtonMessage={alertButtonMessage}
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

export default COIAS;
