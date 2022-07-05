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
  disable: false,
  setManualStarModalShow: () => {},
  isZoomIn: false,
  setIsZoomIn: () => {},
  leadStarNumber: 0,
  activeKey: 0,
  confirmationModalShow: false,
  setConfirmationModalShow: () => {},
  writeMemo: () => {},
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
  disable: PropTypes.bool,
  setManualStarModalShow: PropTypes.func,
  isZoomIn: PropTypes.bool,
  setIsZoomIn: PropTypes.func,
  leadStarNumber: PropTypes.number,
  activeKey: PropTypes.number,
  confirmationModalShow: PropTypes.bool,
  setConfirmationModalShow: PropTypes.func,
  writeMemo: PropTypes.func,
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
  // const ZPCanvas = useRef(null);
  const RECT_WIDTH = 40;
  const RECT_HEIGHT = 40;
  const [IMAGE_WIDTH, setImageWidth] = useState(0);
  const [IMAGE_HEIGHT, setImageHeight] = useState(0);
  const [context, setContext] = useState();
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [zoomValue, setZoomValue] = useState(1.5);
  const [loaded, setLoaded] = useState(0);
  const [scaleButton, setScaleButton] = useState([
    { id: 1, done: false },
    { id: 1.25, done: false },
    { id: 1.5, done: true },
    { id: 2, done: false },
    { id: 3, done: false },
    { id: 6, done: false },
  ]);

  function relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const scaleX = event.target.width / bounds.width; // relationship bitmap vs. element for X
    const scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

    const x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
    const y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

    setCurrentMousePos({ x: parseInt(x, 10), y: parseInt(y, 10) });
  }

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

      context.imageSmoothingEnabled = true;

      if (IMAGE_HEIGHT !== 0 && loaded !== 2) {
        setLoaded(1);
      }

      if (loaded === 1) {
        context.scale(2, 2);
        setLoaded(2);
      }

      context.drawImage(img, 0, 0, img.naturalHeight, img.naturalWidth);

      Object.keys(starPos)
        .map((key) => starPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            // rectangle setting
            const position = pos.page[currentPage];
            const x = position.x - RECT_WIDTH / zoomValue / 2;
            const y =
              img.naturalHeight - position.y - RECT_HEIGHT / zoomValue / 2;
            context.lineWidth = 3 / zoomValue < 1 ? 1 : 3 / zoomValue;
            // set stroke style depends on pos[4]
            context.strokeStyle = pos.isSelected ? 'red' : 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.strokeRect(
              x,
              y,
              RECT_WIDTH / zoomValue,
              RECT_HEIGHT / zoomValue,
            );

            context.strokeStyle = 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = 4 / zoomValue < 2 ? 2 : 4 / zoomValue;
            context.font = `${20 / zoomValue < 8 ? 8 : 20 / zoomValue}px serif`;
            context.strokeText(
              pos.name,
              x - RECT_WIDTH / zoomValue / 10,
              y - RECT_HEIGHT / zoomValue / 10,
            );
            context.fillStyle = 'red';
            context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(
              pos.name,
              x - RECT_WIDTH / zoomValue / 10,
              y - RECT_HEIGHT / zoomValue / 10,
            );
          }
        });
      if (!disable) {
        positionList.forEach((pos, i) =>
          pos.forEach((manualPos) => {
            if (manualPos.page === currentPage) {
              // rectangle setting
              const x = manualPos.x - RECT_WIDTH / zoomValue / 2;
              const y = manualPos.y - RECT_HEIGHT / zoomValue / 2;
              context.strokeStyle = i === activeKey ? 'red' : 'blue';
              context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.strokeRect(
                x,
                y,
                RECT_WIDTH / zoomValue,
                RECT_HEIGHT / zoomValue,
              );

              // font setting
              context.strokeStyle = i === activeKey ? 'red' : 'blue';
              context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.lineWidth = 2;
              context.font = `${
                20 / zoomValue < 8 ? 8 : 20 / zoomValue
              }px serif`;
              context.strokeText(
                `H${'000000'.slice(
                  (leadStarNumber + i).toString().length - 6,
                )}${leadStarNumber + i}`,
                x - RECT_WIDTH / zoomValue / 10,
                y - RECT_HEIGHT / zoomValue / 10,
              );
              context.fillStyle = i === activeKey ? 'white' : 'white';
              context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
              context.fillText(
                `H${'000000'.slice(
                  (leadStarNumber + i).toString().length - 6,
                )}${leadStarNumber + i}`,
                x - RECT_WIDTH / zoomValue / 10,
                y - RECT_HEIGHT / zoomValue / 10,
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
    const point = { x: currentMousePos.x / 2, y: currentMousePos.y / 2 };
    const wHalf = RECT_WIDTH / (zoomValue * 2);
    const hHalf = RECT_HEIGHT / (zoomValue * 2);
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
      disable
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
      .forEach((item) => {
        if (!item.name.startsWith('H')) return null;
        const position = item.page[currentPage];
        if (position && testHit(position.x, position.y)) {
          newStarPos[item.name].isSelected = !item.isSelected;
          document.getElementById(item.name).checked =
            newStarPos[item.name].isSelected;
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

    if (
      currentPageIndex !== -1 &&
      testHit(
        positionList[activeKey][currentPageIndex].x,
        positionList[activeKey][currentPageIndex].y,
        isManual,
      )
    ) {
      setConfirmationModalShow(true);
    } else {
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

  const zoom = (e) => {
    const data = e.target.id;
    // zoomCanvas();
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
      default:
        break;
    }
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
          }}
          onKeyDown={keyInvalid}
        >
          <div ref={ZPCanvasRef}>
            <canvas
              ref={canvasRef}
              width={`${IMAGE_WIDTH * 2}px`}
              height={`${IMAGE_HEIGHT * 2}px`}
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
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
        </div>
      </div>
    </Col>
  );
}

export default PanZoom;
