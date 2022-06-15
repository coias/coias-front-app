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
import ManualStarModal from './ManualStarModalShow';
import useEventListener from '../hooks/useEventListener';

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
  isHide: PropTypes.bool.isRequired,
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
  isHide,
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
  const [context, setContext] = useState();
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [manualStarModalShow, setManualStarModalShow] = useState(false);
  const [scale, setScale] = useState(1);

  function relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const scaleX = event.target.width / bounds.width; // relationship bitmap vs. element for X
    const scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

    const x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
    const y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

    setCurrentMousePos({ x: parseInt(x, 10), y: parseInt(y, 10) });
  }

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

  const removePositionByIndex = (targetListIndex, targetElementIndex) => {
    setPositionList(
      positionList.map((position, index) => {
        if (index === targetListIndex) {
          return position.filter(
            (elementPosition) => targetElementIndex !== elementPosition.page,
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
      transformOrigin: { x: 0.5, y: 0.5 },

      beforeWheel(e) {
        const shouldIgnore = !e.altKey;
        setScale(ZPCanvas.current.getTransform().scale);
        return shouldIgnore;
      },
      beforeMouseDown() {
        return 'ignore';
      },
      filterKey() {
        // don't let panzoom handle this event:
        return true;
      },
    });

    return () => {
      ZPCanvas.current.dispose();
    };
  }, [isReload, isZoomIn]);

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
            let linesize;
            if (3 / scale > 1.5) {
              linesize = 3 / scale;
            } else {
              linesize = 1.5;
            }
            const position = pos.page[currentPage];
            const x = position.x - RECT_WIDTH / scale / 2;
            const y = img.naturalHeight - position.y - RECT_HEIGHT / scale / 2;
            context.lineWidth = linesize;
            // set stroke style depends on pos[4]
            context.strokeStyle = pos.isSelected ? 'red' : 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.strokeRect(x, y, RECT_WIDTH / scale, RECT_HEIGHT / scale);

            // font setting
            let fontsize;
            if (18 / scale > 12) {
              fontsize = String(18 / scale);
            } else {
              fontsize = '12';
            }

            fontsize += 'px serif';
            context.strokeStyle = 'black';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = 3;
            context.font = fontsize;
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
      positionList.forEach((pos, i) =>
        pos.forEach((manualPos) => {
          if (manualPos.page === currentPage) {
            const starNameList = Object.keys(starPos).filter((element) =>
              element.startsWith('H'),
            );
            const headStarNumber = Number(
              starNameList[starNameList.length - 1].replace('H', ''),
            );

            const getStarNumberStr = (index) =>
              `H${'00000'.slice(-(6 - headStarNumber.toString().length))}${
                headStarNumber + index + 1
              }`; // rectangle setting

            let linesize;
            if (3 / scale > 1.5) {
              linesize = 3 / scale;
            } else {
              linesize = 1.5;
            }
            const x = manualPos.x - RECT_WIDTH / scale / 2;
            const y = manualPos.y - RECT_HEIGHT / scale / 2;
            context.lineWidth = linesize;
            // set stroke style depends on manualPos[4]
            context.strokeStyle = 'blue';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.strokeRect(x, y, RECT_WIDTH / scale, RECT_HEIGHT / scale);

            // font setting
            let fontsize;
            if (18 / scale > 12) {
              fontsize = String(18 / scale);
            } else {
              fontsize = '12';
            }

            fontsize += 'px serif';
            context.strokeStyle = 'blue';
            context.strokeStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.lineWidth = 3;
            context.font = fontsize;
            context.strokeText(
              getStarNumberStr(i),
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
            context.fillStyle = 'white';
            context.fillStyle = isHide ? 'rgba(0, 0, 0, 0)' : '';
            context.fillText(
              getStarNumberStr(i),
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
          }
        }),
      );
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
  ]);

  useEventListener('mousemove', relativeCoords, canvasRef.current);

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

  // 再測定時に天体の座標を保存する
  function saveEventPosition() {
    const sval = document.getElementById('selectButton').dataset.active;
    const sshouldIgnore = sval === 'true';

    if (positionList.length < 1 || !sshouldIgnore) return;

    setShow(show);
    const newArr = [...positionList];

    const activeArray = newArr[activeKey];
    const targetIndex = activeArray.findIndex(
      (activeElement) => activeElement.page === currentPage,
    );

    const value = {
      page: currentPage,
      x: currentMousePos.x,
      y: currentMousePos.y,
    };

    if (targetIndex === -1) {
      activeArray.splice(currentPage, 0, value);
    } else {
      activeArray.splice(targetIndex, 1, value);
    }

    setPositionList([...newArr]);

    setManualStarModalShow(true);
  }
  const keyInvalid = (e) => {
    const code = e.keyCode;
    // eslint-disable-next-line default-case
    switch (code) {
      case 37: // ←
      case 38: // ↑
      case 39: // →
      case 40: // ↓
        e.preventDefault();
    }
  };

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
              overflow: 'hidden',
            }}
          >
            <MousePosition />
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className="wrapper"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'relative',
              }}
              onKeyDown={keyInvalid}
            >
              <div
                ref={ZPCanvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={`${IMAGE_WIDTH}px`}
                  height={`${IMAGE_HEIGHT}px`}
                  onClick={() => {
                    if (isManual && !isZoomIn) {
                      saveEventPosition();
                    } else if (!isManual) {
                      changeColorOnClick();
                    }
                  }}
                  style={{
                    filter: `contrast(${contrastVal - 50}%) brightness(${
                      brightnessVal - 50
                    }%)`,
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
      <ManualStarModal
        manualStarModalShow={manualStarModalShow}
        onHide={() => {
          removePositionByIndex(activeKey, currentPage);
          setManualStarModalShow(false);
        }}
        defaultZoomRate={defaultZoomRate}
        imageURLs={imageURLs}
        activeKey={activeKey}
        setPositionList={setPositionList}
        onClickRetry={() => {
          const targetElementIndex = positionList[activeKey].findIndex(
            (activeArray) => activeArray.page === currentPage,
          );
          removePositionByIndex(activeKey, targetElementIndex);
        }}
        onClickNext={() => {
          if (currentPage < 4) {
            setCurrentPage(currentPage + 1);
          }
          setIsZoomIn(false);
          setManualStarModalShow(false);
        }}
      />
    </Container>
  );
}

export default PanZoom;
