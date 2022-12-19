// eslint-disable-next-line object-curly-newline
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
// eslint-disable-next-line object-curly-newline
import { Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useEventListener from '../../../hooks/useEventListener';
import {
  MousePositionContext,
  PageContext,
  StarPositionContext,
  PredictedStarPositionContext,
} from '../../functional/context';
import AlertModal from '../../general/AlertModal';
import MousePosition from '../../ui/MousePosition';
import ImageTimes from '../../ui/ImageTimes';
import BrightnessBar from '../../ui/BrightnessBar';
import ContrastBar from '../COIAS/ContrastBar';

// eslint-disable-next-line no-use-before-define
PanZoom.defaultProps = {
  brightnessVal: 150,
  contrastVal: 150,
  positionList: [],
  disable: false,
  setManualStarModalShow: () => {},
  isZoomIn: false,
  setIsZoomIn: () => {},
  leadStarNumber: 0,
  activeKey: 0,
  confirmationModalShow: false,
  setConfirmationModalShow: () => {},
  writeMemo: () => {},
  setConfirmMessage: () => {},
  setSelectedListState: () => {},
  setRenameNewStarModalShow: () => {},
  setOldStarName: () => {},
};

// eslint-disable-next-line no-use-before-define
PanZoom.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  brightnessVal: PropTypes.number,
  contrastVal: PropTypes.number,
  positionList: PropTypes.arrayOf(PropTypes.array),
  isHide: PropTypes.bool.isRequired,
  disable: PropTypes.bool,
  setManualStarModalShow: PropTypes.func,
  isZoomIn: PropTypes.bool,
  setIsZoomIn: PropTypes.func,
  leadStarNumber: PropTypes.number,
  activeKey: PropTypes.number,
  confirmationModalShow: PropTypes.bool,
  setConfirmationModalShow: PropTypes.func,
  writeMemo: PropTypes.func,
  setConfirmMessage: PropTypes.func,
  setSelectedListState: PropTypes.func,
  scaleArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  wrapperRef: PropTypes.objectOf(PropTypes.object).isRequired,
  setRenameNewStarModalShow: PropTypes.func,
  setOldStarName: PropTypes.func,
  setting: PropTypes.bool.isRequired,
  setSetting: PropTypes.func.isRequired,
  timeList: PropTypes.arrayOf(PropTypes.string).isRequired,
  setBrightnessVal: PropTypes.func.isRequired,
  setContrastVal: PropTypes.func.isRequired,
};

function PanZoom({
  imageURLs,
  brightnessVal,
  contrastVal,
  positionList,
  isHide,
  disable,
  setManualStarModalShow,
  isZoomIn,
  setIsZoomIn,
  leadStarNumber,
  activeKey,
  confirmationModalShow,
  setConfirmationModalShow,
  writeMemo,
  setConfirmMessage,
  setSelectedListState,
  scaleArray,
  wrapperRef,
  setRenameNewStarModalShow,
  setOldStarName,
  setting,
  setSetting,
  timeList,
  setBrightnessVal,
  setContrastVal,
}) {
  if (window.hitIndex === undefined) {
    window.hitIndex = '';
  }
  if (!window.images) {
    window.images = [];
    window.imageLoadComplete = false;
  }
  const canvasRef = useRef(null);
  const ZPCanvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);

  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const [IMAGE_WIDTH, setImageWidth] = useState(0);
  const [IMAGE_HEIGHT, setImageHeight] = useState(0);
  const [context, setContext] = useState();
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { predictedStarPos } = useContext(PredictedStarPositionContext);
  const [loaded, setLoaded] = useState(0);
  const [scaleValue, setScaleValue] = useState(0);
  const [alertModalShow, setAlertModalShow] = useState(false);

  const dataSetOfImageSize = [5100, 2100, 1050];

  const location = useLocation();

  const isCOIAS = location.pathname === '/COIAS';
  const isManual = location.pathname === '/ManualMeasurement';
  const isFinalCheck = location.pathname === '/FinalCheck';

  function relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const scaleX = event.target.width / bounds.width; // relationship bitmap vs. element for X
    const scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

    const x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
    const y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

    setCurrentMousePos({ x: parseInt(x, 10), y: parseInt(y, 10) });
  }

  const calcRectangle = () => {
    const zoomValue = scaleArray.find((obj) => obj.done).id;
    let rectSize;
    if (IMAGE_WIDTH / zoomValue >= 800) {
      rectSize = 40;
    } else if (IMAGE_WIDTH / zoomValue < 800) {
      rectSize = IMAGE_WIDTH / zoomValue / 20;
    } else if (IMAGE_WIDTH / zoomValue < 100) {
      rectSize = 5;
    }
    return rectSize;
  };

  const getZoomValue = useCallback(
    () => scaleArray.find((obj) => obj.done).id,
    [scaleArray],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  const drawImage = async () => {
    if (
      context &&
      window.images.length !== 0 &&
      window.imageLoadComplete &&
      imageURLs.length > 0
    ) {
      const img = imageURLs[currentPage].nomasked
        ? window.images[currentPage][1]
        : window.images[currentPage][0];

      if (setting) setSetting(false);

      setImageHeight(img.naturalHeight);
      setImageWidth(img.naturalWidth);

      context.imageSmoothingEnabled = false;

      if (IMAGE_HEIGHT !== 0 && loaded !== 2) {
        setLoaded(1);
      }

      if (loaded === 1) {
        if (img.naturalHeight > dataSetOfImageSize[1]) {
          context.scale(2, 2);
          setScaleValue(2);
        } else if (img.naturalHeight > dataSetOfImageSize[2]) {
          context.scale(4, 4);
          setScaleValue(4);
        } else {
          context.scale(6, 6);
          setScaleValue(6);
        }
        setLoaded(2);
      }

      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      const RECT_SIZE = calcRectangle();

      Object.keys(predictedStarPos)
        .map((key) => predictedStarPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            context.beginPath();
            const position = pos.page[currentPage];
            const xpos = position.x;
            const ypos = img.naturalHeight - position.y;
            context.lineWidth = RECT_SIZE * 0.075;
            const isThisPredictStarHide =
              isHide || (position.isPredict && isFinalCheck);
            if (isThisPredictStarHide) {
              context.strokeStyle = 'rgba(0, 0, 0, 0)';
            } else if (position.isPredict) {
              context.strokeStyle = 'yellow';
            } else if (!position.isPredict) {
              context.strokeStyle = 'red';
            }
            context.arc(xpos, ypos, RECT_SIZE * 0.8, 0, Math.PI * 2, true);
            context.stroke();

            const prefix = position.isPredict ? '予測: ' : '測定済: ';
            context.strokeStyle = 'black';
            context.strokeStyle = isThisPredictStarHide
              ? 'rgba(0, 0, 0, 0)'
              : '';
            context.lineWidth = RECT_SIZE * 0.075;
            context.font = `${RECT_SIZE * 0.5}px serif`;
            context.strokeText(
              prefix + pos.name,
              xpos - RECT_SIZE * 1.5,
              ypos + RECT_SIZE * 1.3,
            );

            context.fillStyle = position.isPredict ? 'yellow' : 'red';
            context.fillStyle = isThisPredictStarHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(
              prefix + pos.name,
              xpos - RECT_SIZE * 1.5,
              ypos + RECT_SIZE * 1.3,
            );
          }
        });
      Object.keys(starPos)
        .map((key) => starPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            const position = pos.page[currentPage];
            const x = position.x - RECT_SIZE / 2;
            const y = img.naturalHeight - position.y - RECT_SIZE / 2;
            context.lineWidth = RECT_SIZE * 0.075;

            if (isHide) {
              context.strokeStyle = 'rgba(0, 0, 0, 0)';
            } else if (pos.newName && position.name !== pos.newName) {
              context.strokeStyle = 'yellow';
            } else if (pos.isSelected || pos.isKnown) {
              context.strokeStyle = 'red';
            } else if (!pos.isSelected) {
              context.strokeStyle = 'black';
            }
            context.strokeRect(x, y, RECT_SIZE, RECT_SIZE);

            context.strokeStyle = 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = RECT_SIZE * 0.075;
            context.font = `${RECT_SIZE * 0.5}px serif`;
            context.strokeText(
              pos.newName && position.name !== pos.newName
                ? pos.newName
                : pos.name,
              x - RECT_SIZE / 10,
              y - RECT_SIZE / 10,
            );
            context.fillStyle = 'red';
            context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(
              pos.newName && position.name !== pos.newName
                ? pos.newName
                : pos.name,
              x - RECT_SIZE / 10,
              y - RECT_SIZE / 10,
            );
          }
        });
      if (!disable) {
        positionList.forEach((pos, i) =>
          pos.forEach((manualPos) => {
            if (manualPos.page === currentPage) {
              const x = manualPos.x - RECT_SIZE / 2;
              const y = manualPos.y - RECT_SIZE / 2;
              context.strokeStyle = i === activeKey ? 'red' : 'blue';
              context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.strokeRect(x, y, RECT_SIZE, RECT_SIZE);

              // font setting
              context.strokeStyle = i === activeKey ? 'red' : 'blue';
              context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.lineWidth = RECT_SIZE * 0.075;
              context.font = `${RECT_SIZE * 0.5}px serif`;
              context.strokeText(
                `H${'000000'.slice(
                  (leadStarNumber + i).toString().length - 6,
                )}${leadStarNumber + i}`,
                x - RECT_SIZE / 10,
                y - RECT_SIZE / 10,
              );
              context.fillStyle = i === activeKey ? 'white' : 'white';
              context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.fillText(
                `H${'000000'.slice(
                  (leadStarNumber + i).toString().length - 6,
                )}${leadStarNumber + i}`,
                x - RECT_SIZE / 10,
                y - RECT_SIZE / 10,
              );
            }
          }),
        );
      }
    }
  };

  // imageの描画
  useEffect(() => {
    drawImage();
  }, [
    context,
    currentPage,
    starPos,
    IMAGE_HEIGHT,
    isHide,
    positionList,
    activeKey,
    confirmationModalShow,
    disable,
    scaleArray,
    loaded,
    setting,
  ]);

  useEventListener('mousemove', relativeCoords, canvasRef.current);

  // 当たり判定を検出
  function testHit(thisx, thisy, isManualOption = false) {
    const RECT_SIZE = calcRectangle();
    const point = {
      x: currentMousePos.x / scaleValue,
      y: currentMousePos.y / scaleValue,
    };
    const wHalf = RECT_SIZE / 2;
    const hHalf = RECT_SIZE / 2;
    const starX = thisx;
    const starY = isManualOption ? thisy : IMAGE_HEIGHT - thisy;
    return (
      starX - wHalf <= point.x &&
      point.x <= starX + wHalf &&
      starY - hHalf <= point.y &&
      point.y <= starY + hHalf
    );
  }

  // クリック時に色を変化させるイベントリスナー
  function changeColorOnClick() {
    if (isManual || !disable) {
      return;
    }
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }

    window.hitIndex = '';
    // 当たり判定のあった天体を新しくstarPosに上書きする
    const newStarPos = JSON.parse(JSON.stringify(starPos));
    Object.keys(newStarPos)
      .map((key) => newStarPos[key])
      .forEach((item, index) => {
        if (item.isKnown) return null;
        const position = item.page[currentPage];
        if (position && testHit(position.x, position.y)) {
          newStarPos[item.name].isSelected = !item.isSelected;
          setSelectedListState((prevList) => {
            const prevListCopy = prevList.concat();
            prevListCopy[index] = !prevListCopy[index];
            return prevListCopy;
          });
        }
        return null;
      });
    writeMemo(newStarPos);
    setStarPos(newStarPos);
  }

  // 再測定時に天体の座標を保存する
  function saveEventPosition() {
    setIsZoomIn(true);

    if (positionList.length < 1) return;

    const currentPageIndex = positionList[activeKey].findIndex(
      (e) => e.page === currentPage,
    );

    const hitJudge = testHit(
      positionList[activeKey][currentPageIndex]?.x,
      positionList[activeKey][currentPageIndex]?.y,
      isManual,
    );

    if (currentPageIndex !== -1 && hitJudge) {
      setConfirmationModalShow(true);
      setConfirmMessage('を削除しますか？');
    } else if (currentPageIndex !== -1 && !hitJudge) {
      setConfirmationModalShow(true);
      setConfirmMessage('は既に選択されていますが更新しますか？');
    } else if (currentPageIndex === -1) {
      setManualStarModalShow(true);
    }
  }

  const renameNewStar = () => {
    const newStarPos = JSON.parse(JSON.stringify(starPos));
    Object.keys(newStarPos)
      .map((key) => newStarPos[key])
      .forEach((item) => {
        const position = item.page[currentPage];
        if (!item.isKnown && position && testHit(position?.x, position?.y)) {
          setRenameNewStarModalShow(true);
          setOldStarName(item.name);
        } else if (position && testHit(position.x, position.y)) {
          setAlertModalShow(true);
        }
      });
  };

  const calcCanvasSize = (IMAGE_SIZE) => {
    let canvasSize;
    if (IMAGE_SIZE > dataSetOfImageSize[1]) {
      canvasSize = IMAGE_SIZE * 2;
    } else if (IMAGE_SIZE > dataSetOfImageSize[2]) {
      canvasSize = IMAGE_SIZE * 4;
    } else {
      canvasSize = IMAGE_SIZE * 6;
    }
    return canvasSize;
  };

  return (
    <Col>
      <div
        className="main-canvas"
        style={{
          width: '100%',
          height: '100%',
          paddingLeft: 0,
          position: 'relative',
          overflow: 'none',
        }}
      >
        <div className="slidebar-time-wrapper">
          <div className="slidebar-wrapper">
            <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
            <ContrastBar val={contrastVal} set={setContrastVal} />
          </div>
          <MousePosition
            isZoomIn={isZoomIn}
            IMAGE_WIDTH={IMAGE_WIDTH}
            IMAGE_HEIGHT={IMAGE_HEIGHT}
          />
          <ImageTimes timeList={timeList} />
        </div>
        <div
          className="wrapper"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          ref={wrapperRef}
          id="container"
        >
          <div ref={ZPCanvasRef}>
            <canvas
              id="canvas"
              ref={canvasRef}
              width={`${calcCanvasSize(IMAGE_WIDTH)}px`}
              height={`${calcCanvasSize(IMAGE_HEIGHT)}px`}
              onClick={() => {
                if (isManual && !disable) {
                  saveEventPosition();
                } else if (isManual && disable) {
                  renameNewStar();
                } else if (isCOIAS) {
                  changeColorOnClick();
                }
              }}
              style={{
                filter: `contrast(${contrastVal - 50}%) brightness(${
                  brightnessVal - 50
                }%)`,
                transformOrigin: '0 0',
                transform: `scale(${getZoomValue()})`,
                maxWidth: '100%',
                maxHeight: '100%',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>
      </div>
      <AlertModal
        alertModalShow={alertModalShow}
        alertMessage="既知天体の名前は付け替えることはできません"
        onClickOk={() => setAlertModalShow(false)}
        alertButtonMessage="戻る"
      />
    </Col>
  );
}

export default PanZoom;
