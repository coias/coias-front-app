import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  PageContext,
  StarPositionContext,
} from '../component/functional/context';
import AlertModal from '../component/general/AlertModal';
import ErrorModal from '../component/general/ErrorModal';
import LoadingButton from '../component/general/LoadingButton';
import COIASToolBar from '../component/model/MeasurementCommon/COIASToolBar';
import PanZoom from '../component/model/MeasurementCommon/PanZoom';
import PlayMenu from '../component/model/MeasurementCommon/PlayMenu';
import StarsList from '../component/model/MeasurementCommon/StarsList';
import useEventListener from '../hooks/useEventListener';

// eslint-disable-next-line no-use-before-define
FinalCheck.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
  next: PropTypes.bool.isRequired,
  setNext: PropTypes.func.isRequired,
  back: PropTypes.bool.isRequired,
  setBack: PropTypes.func.isRequired,
  setting: PropTypes.bool.isRequired,
  setSetting: PropTypes.func.isRequired,
};

function FinalCheck({
  imageURLs,
  setImageURLs,
  intervalRef,
  start,
  setStart,
  next,
  setNext,
  back,
  setBack,
  setting,
  setSetting,
}) {
  const [isSelect, setIsSelect] = useState(true);
  const [isHide, setIsHide] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [fileNum, setFileNum] = useState(0);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [COIASAlertModalshow, setCOIASAlertModalshow] = useState(false);
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace] = useState('');
  const [errorReason] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtonMessage, setAlertButtonMessage] = useState('');
  const wrapperRef = useRef(null);
  const [validImages] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [navigateDest, setNavigateDest] = useState('');
  const navigate = useNavigate();

  const { setStarPos } = useContext(StarPositionContext);
  const { setCurrentPage } = useContext(PageContext);

  const [scaleArray, setScaleArray] = useState([
    { id: 1, done: true },
    { id: 1.5, done: false },
    { id: 2, done: false },
    { id: 2.5, done: false },
    { id: 3, done: false },
    { id: 3.5, done: false },
    { id: 4, done: false },
    { id: 4.5, done: false },
    { id: 5, done: false },
    { id: 5.5, done: false },
    { id: 6, done: false },
    { id: 6.5, done: false },
    { id: 7, done: false },
    { id: 7.5, done: false },
    { id: 8, done: false },
    { id: 8.5, done: false },
    { id: 9, done: false },
    { id: 9.5, done: false },
    { id: 10, done: false },
    { id: 10.5, done: false },
    { id: 11, done: false },
    { id: 11.5, done: false },
    { id: 12, done: false },
    { id: 12.5, done: false },
    { id: 13, done: false },
    { id: 13.5, done: false },
    { id: 14, done: false },
    { id: 14.5, done: false },
    { id: 15, done: false },
    { id: 15.5, done: false },
    { id: 16, done: false },
    { id: 16.5, done: false },
    { id: 17, done: false },
    { id: 17.5, done: false },
    { id: 18, done: false },
    { id: 18.5, done: false },
    { id: 19, done: false },
    { id: 19.5, done: false },
    { id: 20, done: false },
  ]);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  useEffect(() => {
    const toObjectArray = [];
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
    // nginxにある画像を全て取得
    const getImages = async () => {
      setLoading(true);
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();
      if (dataList.length === 0) {
        setCOIASAlertModalshow(true);
        setAlertMessage('ビニングマスクを行ってください');
        setAlertButtonMessage('探索準備に戻る');
        setNavigateDest('/');
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
      setLoading(false);

      setTimeList(Array(fileNumbers).fill(''));
      await axios
        .get(`${reactApiUri}time_list`)
        .then((res) => res.data.result)
        .then((tmpTimeList) => {
          if (tmpTimeList.length === fileNumbers) {
            setTimeList(tmpTimeList);
          }
        })
        .catch(() => {});
    };

    getImages();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(final_disp.txtの処理)
    // final_disp.txtを取得
    const getFinalDisp = async () => {
      setLoading(true);

      const toObject = {};

      const res1 = await axios.get(`${reactApiUri}final_disp`).catch(() => {
        setCOIASAlertModalshow(true);
        setAlertMessage('レポート作成処理を行ってください');
        setAlertButtonMessage('レポートモードに戻る');
        setNavigateDest('/Report');
      });

      if (res1 !== undefined) {
        const finalDisp = await res1.data.result;
        finalDisp.forEach((item) => {
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
      }

      setStarPos(toObject);
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
          getFinalDisp();
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
  }, [imageURLs]);

  useEventListener('keydown', (e) => {
    e.preventDefault();
    const scrollYRate =
      wrapperRef.current.scrollTop /
      (wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight);

    const scrollXRate =
      wrapperRef.current.scrollLeft /
      (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth);

    if (e.key === 's') {
      setStart(!start);
    } else if (e.key === 'ArrowRight') {
      setNext(!next);
    } else if (e.key === 'ArrowLeft') {
      setBack(!back);
    } else if (e.key === 'ArrowUp') {
      const currentIndex = scaleArray.findIndex((item) => item.done);
      const arrayCopy = scaleArray.concat();
      if (currentIndex < arrayCopy.length - 1) {
        arrayCopy[currentIndex].done = false;
        arrayCopy[currentIndex + 1].done = true;
        wrapperRef.current.scrollBy(400 * scrollXRate, 400 * scrollYRate);
      }
      setScaleArray(arrayCopy);
    } else if (e.key === 'ArrowDown') {
      const currentIndex = scaleArray.findIndex((item) => item.done);
      const arrayCopy = scaleArray.concat();
      if (currentIndex > 0) {
        arrayCopy[currentIndex].done = false;
        arrayCopy[currentIndex - 1].done = true;
        wrapperRef.current.scrollBy(-400 * scrollXRate, -400 * scrollYRate);
      }
      setScaleArray(arrayCopy);
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
            isAutoSave={isAutoSave}
            setIsAutoSave={setIsAutoSave}
            setSetting={setSetting}
          />
          <Container fluid>
            <Row className="m-0 p-0">
              <COIASToolBar
                isSelect={isSelect}
                setIsSelect={setIsSelect}
                brightnessVal={brightnessVal}
                contrastVal={contrastVal}
                setBrightnessVal={setBrightnessVal}
                setContrastVal={setContrastVal}
                isHide={isHide}
                setIsHide={setIsHide}
              />
              <Col>
                <PanZoom
                  imageURLs={imageURLs}
                  brightnessVal={brightnessVal}
                  contrastVal={contrastVal}
                  isHide={isHide}
                  disable={disable}
                  scaleArray={scaleArray}
                  wrapperRef={wrapperRef}
                  setting={setting}
                  setSetting={setSetting}
                  timeList={timeList}
                />
              </Col>
            </Row>
          </Container>
        </Col>
        <div className="coias-star-list-wrraper">
          <StarsList disable={disable} />
        </div>
      </Row>
      <LoadingButton loading={loading} processName="最終確認データ取得中…" />

      <AlertModal
        alertModalShow={COIASAlertModalshow}
        onClickOk={() => {
          navigate(navigateDest);
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

export default FinalCheck;
