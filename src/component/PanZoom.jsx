// eslint-disable-next-line object-curly-newline
import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
// eslint-disable-next-line object-curly-newline
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  PageContext,
  MousePositionContext,
  StarPositionContext,
} from './context';
import MousePosition from './MousePosition';
import useEventListener from '../hooks/useEventListener';

// eslint-disable-next-line no-use-before-define
PanZoom.defaultProps = {
  isManual: false,
  isReload: false,
  brightnessVal: 150,
  contrastVal: 150,
  positionList: [],
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
};

// eslint-disable-next-line no-use-before-define
PanZoom.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  isReload: PropTypes.bool,
  brightnessVal: PropTypes.number,
  contrastVal: PropTypes.number,
  isManual: PropTypes.bool,
  positionList: PropTypes.arrayOf(PropTypes.array),
  isHide: PropTypes.bool.isRequired,
  disable: PropTypes.bool.isRequired,
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
};

function PanZoom({
  imageURLs,
  isReload,
  brightnessVal,
  contrastVal,
  isManual,
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
  const [loaded, setLoaded] = useState(0);
  const [scaleValue, setScaleValue] = useState(0);

  const dataSetOfImageSize = [5100, 2100, 1050];

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

      Object.keys(starPos)
        .map((key) => starPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            const position = pos.page[currentPage];
            const x = position.x - RECT_SIZE / 2;
            const y = img.naturalHeight - position.y - RECT_SIZE / 2;
            context.lineWidth = RECT_SIZE * 0.075;
            context.strokeStyle = pos.isSelected ? 'red' : 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.strokeRect(x, y, RECT_SIZE, RECT_SIZE);

            context.strokeStyle = 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = RECT_SIZE * 0.075;
            context.font = `${RECT_SIZE * 0.5}px serif`;
            context.strokeText(
              pos.name,
              x - RECT_SIZE / 10,
              y - RECT_SIZE / 10,
            );
            context.fillStyle = 'red';
            context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(pos.name, x - RECT_SIZE / 10, y - RECT_SIZE / 10);
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
    isReload,
    IMAGE_HEIGHT,
    isHide,
    positionList,
    activeKey,
    confirmationModalShow,
    disable,
    scaleArray,
    loaded,
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
    if (
      isManual ||
      document.getElementById('selectButton').dataset.active !== 'true' ||
      !disable
    ) {
      return;
    }
    const canvasElem = canvasRef.current;
    const isSelect = document.getElementById('selectButton').dataset.active;
    if (canvasElem === null || isSelect === 'false') {
      return;
    }

    window.hitIndex = '';
    // 当たり判定のあった天体を新しくstarPosに上書きする
    const newStarPos = JSON.parse(JSON.stringify(starPos));
    Object.keys(newStarPos)
      .map((key) => newStarPos[key])
      .forEach((item, index) => {
        if (!item.name.startsWith('H')) return null;
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
    if (disable) return;

    setIsZoomIn(true);
    const sval = document.getElementById('selectButton').dataset.active;
    const sshouldIgnore = sval === 'true';

    if (positionList.length < 1 || !sshouldIgnore) return;

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
          height: '108%',
          paddingLeft: 0,
          position: 'relative',
          overflow: 'none',
        }}
      >
        <MousePosition
          isZoomIn={isZoomIn}
          IMAGE_WIDTH={IMAGE_WIDTH}
          IMAGE_HEIGHT={IMAGE_HEIGHT}
        />
        <div
          className="wrapper"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'none',
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
                if (isManual) {
                  saveEventPosition();
                } else {
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
    </Col>
  );
}

export default PanZoom;
