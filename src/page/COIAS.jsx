import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';
import { StarPositionContext, PageContext } from '../component/context';
import COIASToolBar from '../component/COIASToolBar';
import LoadingButton from '../component/LoadingButton';
import StarsList from '../component/StarsList';
import NewStarModal from '../component/NewStarModal';
import ErrorModal from '../component/ErrorModal';

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
}) {
  const [isSelect, setIsSelect] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [starModalShow, setStarModalShow] = useState(false);
  const [fileNum, setFileNum] = useState(0);
  const [memoList, setMemoList] = useState([]);
  const [selectedListState, setSelectedListState] = useState([]);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [validImages, setValidImages] = useState([]);
  const [setting, setSetting] = useState(false);

  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/Report');
  };

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
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();
      setFileNum(dataList.length / 2);

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
    };
    const getMemo = async () => {
      await axios
        .get(`${reactApiUri}memo`)
        .then((res) => setMemoList(res.data.memo))
        .catch((e) => console.error(e));
    };

    getImages();
    getMemo();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
    // unknown_disp.txtを取得
    const getDisp = async () => {
      setLoading(true);

      const res1 = await axios.get(`${reactApiUri}unknown_disp`);
      const unknownDisp = await res1.data.result;
      const toObject = {};

      // 選択を同期させるため、オブジェクトに変更
      unknownDisp.forEach((item) => {
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

      const res2 = await axios
        .get(`${reactApiUri}karifugo_disp`)
        .catch(() => {});
      const res3 = await axios
        .get(`${reactApiUri}numbered_disp`)
        .catch(() => {});
      if (res2 !== undefined) {
        const knownDisp = await res2.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(fileNum).fill(null),
              isSelected: memoList.find(
                (memoName) => memoName === item[0].replace('H', ''),
              ),
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
              isSelected: memoList.find(
                (memoName) => memoName === item[0].replace('H', ''),
              ),
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
      setLoading(false);
    };

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
        if (window.imageLoadComplete && !isReload && isAutoSave) {
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
    if (validImages.length !== 0) setCurrentPage(validImages[0]);
    else setCurrentPage(0);
    document.getElementById('wrapper-coias').focus();
  }, [imageURLs, memoList, isReload]);

  // 探索終了ボタンが押された時の処理
  const onClickFinishButton = async (num) => {
    // memo.txtへの出力
    const selectedStars = Object.keys(starPos)
      .map((key) => starPos[key])
      .filter((item) => item.isSelected)
      .map((item) => item.name.substring(1));
    await axios.put(`${reactApiUri}memo`, selectedStars);

    await axios
      .put(`${reactApiUri}AstsearchR_between_COIAS_and_ReCOIAS?num=${num}`)
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
      })
      .catch((e) => {
        const errorResponse = e.response?.data?.detail;
        if (errorResponse.place) {
          setErrorPlace(errorResponse.place);
          setErrorReason(errorResponse.reason);
          setShowProcessError(true);
        }
      });

    // rename
    await axios.put(`${reactApiUri}rename`);
  };

  const keyPress = (e) => {
    if (e.keyCode === 83) setStart(!start);
    if (e.keyCode === 39) setNext(!next);
    if (e.keyCode === 37) setBack(!back);
  };

  const onStarModalExit = () => {
    setDisable(false);
    setStarModalShow(false);
  };

  const writeMemo = async (newStarPos) => {
    // memo.txtへの出力
    const selectedStars = Object.values(newStarPos)
      .filter((p) => p.isSelected)
      .map((e) => e.name.replace('H', ''));
    await axios.put(`${reactApiUri}memo`, selectedStars);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="coias-view-main"
      onKeyDown={keyPress}
      tabIndex={-1}
      id="wrapper-coias"
    >
      <PlayMenu
        imageNames={imageURLs}
        setImageURLs={setImageURLs}
        validImages={validImages}
        setValidImages={setValidImages}
        subImageURLs={subImageURLs}
        intervalRef={intervalRef}
        start={start}
        next={next}
        setNext={setNext}
        back={back}
        setBack={setBack}
        onClickFinishButton={onClickFinishButton}
        disable={disable}
        setDisable={setDisable}
        setStarModalShow={setStarModalShow}
        originalStarPos={originalStarPos}
        handleClick={handleClick}
        setStarPos={setStarPos}
        fileNum={fileNum}
        isAutoSave={isAutoSave}
        setIsAutoSave={setIsAutoSave}
        setOriginalStarPos={setOriginalStarPos}
        setSetting={setSetting}
      />
      <Container fluid>
        <Row>
          <COIASToolBar
            isSelect={isSelect}
            setIsSelect={setIsSelect}
            brightnessVal={brightnessVal}
            contrastVal={contrastVal}
            setBrightnessVal={setBrightnessVal}
            setContrastVal={setContrastVal}
            isReload={isReload}
            setIsReload={setIsReload}
            isHide={isHide}
            setIsHide={setIsHide}
          />
          <Col md={10}>
            <PanZoom
              imageURLs={imageURLs}
              isReload={isReload}
              brightnessVal={brightnessVal}
              contrastVal={contrastVal}
              onClickFinishButton={onClickFinishButton}
              originalStarPos={originalStarPos}
              starPos={starPos}
              setStarPos={setStarPos}
              isHide={isHide}
              setStarModalShow={starModalShow}
              disable={disable}
              setSelectedListState={setSelectedListState}
              writeMemo={isAutoSave ? writeMemo : () => {}}
              setting={setting}
              setSetting={setSetting}
            />
          </Col>
          <Col md={1} sm={1}>
            <StarsList
              disable={disable}
              writeMemo={isAutoSave ? writeMemo : () => {}}
              selectedListState={selectedListState}
              setSelectedListState={setSelectedListState}
            />
          </Col>
        </Row>
      </Container>
      <LoadingButton loading={loading} processName="探索データ取得中…" />
      <NewStarModal
        show={starModalShow}
        onExit={() => {
          onStarModalExit();
        }}
        onClickFinishButton={onClickFinishButton}
      />
      <ErrorModal
        show={showProcessError}
        setShow={setShowProcessError}
        errorPlace={errorPlace}
        errorReason={errorReason}
      />
    </div>
  );
}

export default COIAS;
