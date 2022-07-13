// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Col, Button } from 'react-bootstrap';
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
  // eslint-disable-next-line react/require-default-props
  // setCanvasScale: PropTypes.func,
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
  // setCanvasScale,
}) {
  if (window.hitIndex === undefined) {
    window.hitIndex = '';
  }
  if (!window.images) {
    window.images = [];
    window.imageLoadComplete = false;
  }
  const ZPCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);

  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const [IMAGE_WIDTH, setImageWidth] = useState(0);
  const [IMAGE_HEIGHT, setImageHeight] = useState(0);
  const [context, setContext] = useState();
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [zoomValue, setZoomValue] = useState(1.5);
  const [loaded, setLoaded] = useState(0);
  const [scaleValue, setScaleValue] = useState(0);
  const [scaleButton, setScaleButton] = useState([
    { id: 1, done: false },
    { id: 1.25, done: false },
    { id: 1.5, done: true },
    { id: 2, done: false },
    { id: 3, done: false },
    { id: 6, done: false },
    { id: 10, done: false },
    { id: 20, done: false },
  ]);

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
    let rectSize;
    if (IMAGE_WIDTH / zoomValue >= 400) {
      rectSize = 40;
    } else if (IMAGE_WIDTH / zoomValue < 400) {
      rectSize = IMAGE_WIDTH / zoomValue / 15;
    } else if (IMAGE_WIDTH / zoomValue < 50) {
      rectSize = 5;
    }
    return rectSize;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  const drawImage = async () => {
    if (
      context &&
      Object.keys(starPos).length > 0 &&
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
          // setCanvasScale(2);
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
      // console.log(
      //   '画像サイズ : ',
      //   IMAGE_WIDTH,
      //   '/',
      //   zoomValue,
      //   '=',
      //   IMAGE_WIDTH / zoomValue,
      // );
      // console.log('四角のサイズ : ', RECT_SIZE);

      Object.keys(starPos)
        .map((key) => starPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            // rectangle setting
            const position = pos.page[currentPage];
            const x = position.x - RECT_SIZE / 2;
            const y = img.naturalHeight - position.y - RECT_SIZE / 2;
            context.lineWidth = RECT_SIZE * 0.075;
            // set stroke style depends on pos[4]
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
    zoomValue,
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
          // document.getElementById(item.name).checked =
          //   newStarPos[item.name].isSelected;
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

  const keyInvalid = (e) => {
    const code = e.keyCode;
    // eslint-disable-next-line default-case
    switch (code) {
      case 37: // ←
      case 39: // →
        e.preventDefault();
    }
  };

  const updateScaleButton = (id) => {
    setScaleButton((prevScaleButton) =>
      prevScaleButton.map((items) =>
        items.id === id
          ? {
              id: items.id,
              done: true,
            }
          : {
              id: items.id,
              done: false,
            },
      ),
    );
  };

  const [maxTop, setMaxTop] = useState(0);
  const [maxLeft, setMaxLeft] = useState(0);

  useEffect(() => {
    // scroll
    const div = document.getElementById('container');
    const pastScrollTop = div.scrollTop;
    const pastScrollLeft = div.scrollLeft;
    div.scrollTop = 1000000;
    div.scrollLeft = 1000000;
    const MAX_SCROLLTOP = div.scrollTop;
    const MAX_SCROLLLEFT = div.scrollLeft;
    setMaxTop(MAX_SCROLLTOP);
    setMaxLeft(MAX_SCROLLLEFT);

    let topDiff;
    let leftDiff;
    let judge;

    if (MAX_SCROLLTOP - maxTop < 0) {
      topDiff = (maxTop - MAX_SCROLLTOP) / 2;
      judge = 'zoomOut';
    } else {
      topDiff = (MAX_SCROLLTOP - maxTop) / 2;
      judge = 'zoomIn';
    }
    if (MAX_SCROLLLEFT - maxLeft < 0) {
      leftDiff = (maxLeft - MAX_SCROLLLEFT) / 2;
      judge = 'zoomOut';
    } else {
      leftDiff = (MAX_SCROLLLEFT - maxLeft) / 2;
      judge = 'zoomIn';
    }

    div.scrollTop = 0;
    div.scrollLeft = 0;

    if (judge === 'zoomIn') {
      div.scrollTop = pastScrollTop + topDiff;
      div.scrollLeft = pastScrollLeft + leftDiff;
    } else {
      div.scrollTop = pastScrollTop - topDiff;
      div.scrollLeft = pastScrollLeft - leftDiff;
    }
    console.log(div.scrollTop);
    console.log(div.scrollLeft);
  }, [zoomValue]);

  const zoom = (e) => {
    const data = e.target.id;
    switch (data) {
      case '1':
        setZoomValue(1);
        updateScaleButton(1);
        break;
      case '1.25':
        setZoomValue(1.25);
        updateScaleButton(1.25);
        break;
      case '1.5':
        setZoomValue(1.5);
        updateScaleButton(1.5);
        break;
      case '2':
        setZoomValue(2);
        updateScaleButton(2);
        break;
      case '3':
        setZoomValue(3);
        updateScaleButton(3);
        break;
      case '6':
        setZoomValue(6);
        updateScaleButton(6);
        break;
      case '10':
        setZoomValue(10);
        updateScaleButton(10);
        break;
      case '20':
        setZoomValue(20);
        updateScaleButton(20);
        break;
      default:
        break;
    }
  };

  const calcCanvasWidth = () => {
    let canvasSize;
    if (IMAGE_WIDTH > dataSetOfImageSize[1]) {
      canvasSize = IMAGE_WIDTH * 2;
    } else if (IMAGE_WIDTH > dataSetOfImageSize[2]) {
      canvasSize = IMAGE_WIDTH * 4;
    } else {
      canvasSize = IMAGE_WIDTH * 6;
    }
    return canvasSize;
  };

  const calcCanvasHeight = () => {
    let canvasSize;
    if (IMAGE_HEIGHT > dataSetOfImageSize[1]) {
      canvasSize = IMAGE_HEIGHT * 2;
    } else if (IMAGE_HEIGHT > dataSetOfImageSize[2]) {
      canvasSize = IMAGE_HEIGHT * 4;
    } else {
      canvasSize = IMAGE_HEIGHT * 6;
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
          overflow: 'nonw',
        }}
      >
        <MousePosition isZoomIn={isZoomIn} />
        <div>
          {scaleButton.map((item) => (
            <Button
              variant={item.done ? 'primary' : 'secondary'}
              id={item.id}
              onClick={(e) => zoom(e)}
            >
              {`×${item.id}`}
            </Button>
          ))}
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="wrapper"
          style={{
            width: '100%',
            height: 'calc(100% - 40px)',
            position: 'relative',
            overflow: 'none',
          }}
          onKeyDown={keyInvalid}
          id="container"
        >
          <div ref={ZPCanvasRef}>
            <canvas
              id="canvas"
              ref={canvasRef}
              width={`${calcCanvasWidth()}px`}
              height={`${calcCanvasHeight()}px`}
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
                transform: `scale(${zoomValue})`,
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
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
