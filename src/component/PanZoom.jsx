// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState } from 'react';
import panzoom from 'panzoom';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line object-curly-newline
import { Container, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext, MousePositionContext } from './context';

import StarsList from './StarsList';
import MousePosition from './MousePosition';
import NewStarModal from './NewStarModal';
import RectangleConfModal from './RectangleConfModal';

// eslint-disable-next-line no-use-before-define
PanZoom.defaultProps = {
  isManual: false,
  isReload: false,
  show: false,
  brightnessVal: 150,
  contrastVal: 150,
  onClickFinishButton: () => {},
  setShow: () => {},
  setPositionList: () => {},
  positionList: [],
  firstPosition: {},
  setFirstPosition: () => {},
  setIsHide: () => {},
  activeKey: 0,
  defaultZoomRate: 20,
};

// eslint-disable-next-line no-use-before-define
PanZoom.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  starPos: PropTypes.objectOf(PropTypes.object).isRequired,
  setStarPos: PropTypes.func.isRequired,
  isReload: PropTypes.bool,
  brightnessVal: PropTypes.number,
  contrastVal: PropTypes.number,
  onClickFinishButton: PropTypes.func,
  isManual: PropTypes.bool,
  positionList: PropTypes.arrayOf(PropTypes.array),
  setPositionList: PropTypes.func,
  setShow: PropTypes.func,
  show: PropTypes.bool,
  firstPosition: PropTypes.objectOf(PropTypes.object),
  setFirstPosition: PropTypes.func,
  isHide: PropTypes.bool.isRequired,
  isGrab: PropTypes.bool.isRequired,
  setIsHide: PropTypes.func,
  activeKey: PropTypes.number,
  defaultZoomRate: PropTypes.number,
};

function PanZoom({
  imageURLs,
  isReload,
  brightnessVal,
  contrastVal,
  onClickFinishButton,
  originalStarPos,
  starPos,
  setStarPos,
  isManual,
  positionList,
  setPositionList,
  setShow,
  show,
  firstPosition,
  setFirstPosition,
  isHide,
  isGrab,
  setIsHide,
  activeKey,
  defaultZoomRate,
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
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/Report');
  };
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const ZPCanvas = useRef(null);
  const RECT_WIDTH = 40;
  const RECT_HEIGHT = 40;
  const [IMAGE_WIDTH, setImageWidth] = useState(0);
  const [IMAGE_HEIGHT, setImageHeight] = useState(0);
  const [starModalShow, setStarModalShow] = useState(false);
  const [rectangleModalShow, setRectangleModalShow] = useState(false);
  const [context, setContext] = useState();
  const [canvasManualRectangleCoordinates, setCanvasManualRectanglCoordinates] =
    useState([]);
  const [isZoomIn, setIsZoomIn] = useState(false);

  const onStarModalExit = () => {
    setDisable(false);
    Array.from(document.getElementsByClassName('form-check-input')).forEach(
      (item) => {
        // eslint-disable-next-line no-param-reassign
        item.checked = false;
      },
    );
    setStarModalShow(false);
  };

  const onRectangleModalExit = () => {
    setRectangleModalShow(false);
  };

  const removePositionByIndex = (targetListIndex, targetElementIndex) => {
    setPositionList(
      positionList.map((position, index) => {
        if (index === targetListIndex) {
          return position.filter(
            (elementPosition, elementIndex) =>
              targetElementIndex !== elementIndex,
          );
        }
        return position;
      }),
    );
  };

  // panzoomのコンストラクター
  useEffect(() => {
    ZPCanvas.current = panzoom(ZPCanvasRef.current, {
      maxZoom: 100,
      minZoom: 1,
      zoomDoubleClickSpeed: 1,

      beforeWheel(e) {
        // if (isManual) return false;
        const shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
      beforeMouseDown() {
        return 'ignore';
      },
    });

    const lastEl = positionList[positionList.length - 1];

    if (lastEl) {
      ZPCanvas.current.smoothZoom(
        firstPosition.x,
        firstPosition.y,
        defaultZoomRate,
      );
    }

    return () => {
      ZPCanvas.current.dispose();
    };
  }, [firstPosition, isReload]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  });

  const drawImage = () => {
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
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      Object.keys(starPos)
        .map((key) => starPos[key])
        .forEach((pos) => {
          if (pos.page[currentPage]) {
            // rectangle setting
            const position = pos.page[currentPage];
            const x = position.x - RECT_WIDTH / 2;
            const y = img.naturalHeight - position.y - RECT_HEIGHT / 2;
            context.lineWidth = 2;
            // set stroke style depends on pos[4]
            context.strokeStyle = pos.isSelected ? 'red' : 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.strokeRect(x, y, RECT_WIDTH, RECT_HEIGHT);

            // font setting
            context.strokeStyle = 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = 3;
            context.font = '18px serif';
            context.strokeText(
              pos.name,
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
            context.fillStyle = 'red';
            context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(
              pos.name,
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
          }
        });
    }
  };

  // imageの描画
  useEffect(() => {
    drawImage();
  }, [context, currentPage, starPos, isReload, IMAGE_HEIGHT, isHide]);

  // マウス移動時の挙動制御
  useEffect(() => {
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }
    function relativeCoords(event) {
      const bounds = event.target.getBoundingClientRect();
      const scaleX = event.target.width / bounds.width; // relationship bitmap vs. element for X
      const scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

      const x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
      const y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

      setCurrentMousePos({ x: parseInt(x, 10), y: parseInt(y, 10) });
    }

    canvasElem.addEventListener('mousemove', relativeCoords);
  }, []);

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

    const point = currentMousePos;

    // 当たり判定を検出
    function testHit(thisx, thisy) {
      const wHalf = RECT_WIDTH / 2;
      const hHalf = RECT_HEIGHT / 2;
      const starX = thisx;
      const starY = IMAGE_HEIGHT - thisy;

      return (
        starX - wHalf <= point.x &&
        point.x <= starX + wHalf &&
        starY - hHalf <= point.y &&
        point.y <= starY + hHalf
      );
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
    setStarPos(newStarPos);
  }

  function getForthPoint(coordinates) {
    const A = coordinates[0];
    const B = coordinates[1];
    const C = coordinates[2];
    if (A === B || B === C || A === C) {
      console.log('no');
    }

    const width = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
    const height = Math.sqrt((C.x - B.x) ** 2 + (C.y - B.y) ** 2);
    const center = {
      x: Math.floor((A.x + C.x) / 2.0),
      y: Math.floor((A.y + C.y) / 2.0),
    };

    let angle;
    if (B.x !== A.x) {
      angle = Math.atan((B.y - A.y) / (B.x - A.x));
    } else if (B.x - A.x > 0.0) {
      angle = 0.5 * Math.PI;
    } else {
      angle = -0.5 * Math.PI;
    }

    const e1 = { x: Math.cos(angle), y: Math.sin(angle) };
    const e2 = {
      x: Math.cos(angle + 0.5 * Math.PI),
      y: Math.sin(angle + 0.5 * Math.PI),
    };

    const rectPos1 = {
      x: Math.floor(center.x - 0.5 * width * e1.x - 0.5 * height * e2.x),
      y: Math.floor(center.y - 0.5 * width * e1.y - 0.5 * height * e2.y),
    };
    const rectPos2 = {
      x: Math.floor(rectPos1.x + width * e1.x),
      y: Math.floor(rectPos1.y + width * e1.y),
    };
    const rectPos3 = {
      x: Math.floor(rectPos2.x + height * e2.x),
      y: Math.floor(rectPos2.y + height * e2.y),
    };
    const rectPos4 = {
      x: Math.floor(rectPos3.x - width * e1.x),
      y: Math.floor(rectPos3.y - width * e1.y),
    };

    setPositionList((prevPositionList) => {
      const prevPositionListCopy = [...prevPositionList];
      const targetElement = prevPositionListCopy[activeKey][currentPage];
      const value = {
        page: currentPage,
        x: center.x,
        y: center.y,
        width,
        height,
        center,
        angle,
        rectPos1,
        rectPos2,
        rectPos3,
        rectPos4,
      };
      if (targetElement && targetElement.page === currentPage) {
        prevPositionListCopy[activeKey].splice(currentPage, 1, value);
      } else if (targetElement && targetElement.page !== currentPage) {
        prevPositionListCopy[activeKey].splice(currentPage, 0, value);
      } else {
        prevPositionListCopy[activeKey].splice(
          prevPositionListCopy[activeKey].length - 1,
          1,
          value,
        );
      }

      return prevPositionListCopy;
    });

    const finalCoordinates = [rectPos1, rectPos2, rectPos3, rectPos4];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(finalCoordinates[i].x, finalCoordinates[i].y);
      context.lineTo(finalCoordinates[i + 1].x, finalCoordinates[i + 1].y);
      context.stroke();
    }
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(rectPos4.x, rectPos4.y);
    context.lineTo(rectPos1.x, rectPos1.y);
    context.stroke();
  }

  function drawDot() {
    if (!context) {
      return;
    }
    context.strokeStyle = 'black';
    // rectangle setting
    const coordinate = currentMousePos;
    setCanvasManualRectanglCoordinates([
      ...canvasManualRectangleCoordinates,
      coordinate,
    ]);
    canvasManualRectangleCoordinates.push(coordinate);
    context.beginPath();
    context.arc(coordinate.x, coordinate.y, 1, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();

    const cmrcLength = canvasManualRectangleCoordinates.length;
    if (cmrcLength === 3) {
      getForthPoint(canvasManualRectangleCoordinates);

      setRectangleModalShow(true);

      setCanvasManualRectanglCoordinates([]);
      setIsZoomIn(false);
    }
  }

  // 再測定時に天体の座標を保存する
  function saveEventPosition() {
    const gval = document.getElementById('grabButton').dataset.active;
    const gshouldIgnore = gval === 'true';
    const sval = document.getElementById('selectButton').dataset.active;
    const sshouldIgnore = sval === 'true';

    if (positionList.length < 1 || gshouldIgnore || !sshouldIgnore) return;

    setShow(show);
    const posListLen = positionList.length;
    const currentEl = positionList[posListLen - 1][currentPage];

    if (currentEl) {
      console.log(currentEl, currentEl.length);
    }
    if (
      !currentEl ||
      currentEl.length === 0 ||
      currentEl.page === currentPage
    ) {
      setFirstPosition(currentMousePos);
      setIsHide(true);
    }
    // copying the old datas array
    const newArr = [...positionList];
    const value = {
      page: currentPage,
      x: currentMousePos.x,
      y: currentMousePos.y,
    };
    if (
      newArr[activeKey][currentPage] &&
      newArr[activeKey][currentPage].page === currentPage
    ) {
      newArr[activeKey].splice(currentPage, 1, value);
    } else if (
      newArr[activeKey][currentPage] &&
      newArr[activeKey][currentPage].page !== currentPage
    ) {
      newArr[activeKey].splice(currentPage, 0, value);
    } else {
      newArr[activeKey].splice(currentPage, 1, value);
    }

    setPositionList([...newArr]);

    setIsZoomIn(true);
  }

  return (
    <Container fluid>
      <Row className="star-canvas-container">
        <Col sm={isManual ? 12 : 10}>
          <div
            style={{
              width: '100%',
              height: '100%',
              paddingTop: '24px',
              position: 'relative',
            }}
          >
            <MousePosition />
            <div
              className="wrapper"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'relative',
              }}
            >
              <div ref={ZPCanvasRef}>
                <canvas
                  ref={canvasRef}
                  width={`${IMAGE_WIDTH}px`}
                  height={`${IMAGE_HEIGHT}px`}
                  onClick={() => {
                    if (isManual && !isZoomIn) {
                      saveEventPosition();
                    } else if (isManual && isZoomIn) {
                      drawDot();
                    } else if (!isManual) {
                      changeColorOnClick();
                    }
                  }}
                  style={{
                    filter: `contrast(${contrastVal - 50}%) brightness(${
                      brightnessVal - 50
                    }%)`,
                    cursor: isGrab === true ? 'grab' : '',
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
        {!isManual && (
          <Col sm={2}>
            <Button
              variant="success"
              onClick={() => {
                setDisable(!disable);
                // eslint-disable-next-line no-unused-expressions
                disable ? setStarModalShow(true) : setStarPos(originalStarPos);
              }}
              style={{ width: '110px' }}
              className="mb-3 p-3"
            >
              {disable ? '再描画' : 'やり直す'}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleClick();
              }}
              style={{ width: '110px' }}
              className="mb-3 p-3"
              disabled={disable}
            >
              探索終了
            </Button>
            <StarsList disable={disable} />
          </Col>
        )}
      </Row>
      <NewStarModal
        show={starModalShow}
        onExit={() => {
          onStarModalExit();
        }}
        onClickFinishButton={onClickFinishButton}
      />
      <RectangleConfModal
        show={rectangleModalShow}
        onExit={() => {
          onRectangleModalExit();
        }}
        onClickNext={() => {
          if (currentPage < 4) {
            setCurrentPage(currentPage + 1);
          }
          setFirstPosition({});
          setIsHide(false);
        }}
        onClickRetry={() => {
          const targetListIndex = positionList.length - 1;
          const targetElementIndex = positionList[targetListIndex].length - 1;
          removePositionByIndex(targetListIndex, targetElementIndex);
          drawImage();
        }}
      />
    </Container>
  );
}

export default PanZoom;
