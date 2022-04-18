// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState } from 'react';
import panzoom from 'panzoom';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line object-curly-newline
import { Container, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext, MousePositionContext } from './context';
import LoadingButton from './LoadingButton';

import StarsList from './StarsList';
import MousePosition from './MousePosition';

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
  firstPosition: PropTypes.bool,
  setFirstPosition: PropTypes.func,
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
  const [loading, setLoading] = useState(false);

  // panzoomのコンストラクター
  useEffect(() => {
    ZPCanvas.current = panzoom(ZPCanvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 0.7,
      zoomDoubleClickSpeed: 1,
      transformOrigin: { x: 0.5, y: 0.5 },
      beforeWheel(e) {
        // if (isManual) return false;
        const shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
      beforeMouseDown() {
        // スクロールされる前にisGrabの値を確認
        const val = document.getElementById('grabButton').dataset.active;
        const shouldIgnore = !(val === 'true');
        return shouldIgnore;
      },
    });

    const lastEl = positionList[positionList.length - 1];

    if (lastEl)
      ZPCanvas.current.smoothZoom(firstPosition.x, firstPosition.y, 5);

    return () => {
      ZPCanvas.current.dispose();
    };
  }, [firstPosition, isReload]);

  // imageの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (
      context &&
      Object.keys(starPos).length > 0 &&
      window.images.length !== 0 &&
      window.imageLoadComplete &&
      imageURLs.length > 0
    ) {
      const w = canvas.width;
      canvas.width = w;
      const img = imageURLs[currentPage].nomasked
        ? window.images[currentPage][1]
        : window.images[currentPage][0];

      setImageHeight(img.naturalHeight);
      setImageWidth(img.naturalWidth);
      setLoading(true);
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      setLoading(false);
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
            context.strokeRect(x, y, RECT_WIDTH, RECT_HEIGHT);

            // font setting
            context.strokeStyle = 'black';
            context.lineWidth = 3;
            context.font = '18px serif';
            context.strokeText(
              pos.name,
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
            context.fillStyle = 'red';
            context.fillText(
              pos.name,
              x - RECT_WIDTH / 10,
              y - RECT_HEIGHT / 10,
            );
          }
        });
    }
  }, [currentPage, starPos, isReload, IMAGE_HEIGHT, IMAGE_HEIGHT]);

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
        if (item.name.startsWith('K')) return null;
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

  function saveEventPosition() {
    const gval = document.getElementById('grabButton').dataset.active;
    const gshouldIgnore = gval === 'true';
    const sval = document.getElementById('selectButton').dataset.active;
    const sshouldIgnore = sval === 'true';

    if (!isManual || positionList.length < 1 || gshouldIgnore || !sshouldIgnore)
      return null;

    setShow(show);
    const posListLen = positionList.length;
    const lastEl = positionList[posListLen - 1];

    if (lastEl.length === 5) return null;

    if (currentPage === 0 && lastEl.length === 0)
      setFirstPosition(currentMousePos);
    // copying the old datas array
    const newArr = [...positionList];
    newArr[posListLen - 1].push({ currentMousePos });

    setPositionList([...newArr]);
    if (currentPage < 4) setCurrentPage(currentPage + 1);

    return null;
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
              overflow: 'hidden',
            }}
          >
            <MousePosition />
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: 'gray',
                position: 'relative',
              }}
            >
              {loading ? (
                <LoadingButton loading={loading} />
              ) : (
                <div className="canvas-wapper" ref={ZPCanvasRef}>
                  <canvas
                    ref={canvasRef}
                    width={`${IMAGE_WIDTH}px`}
                    height={`${IMAGE_HEIGHT}px`}
                    onClick={() => {
                      changeColorOnClick();
                      saveEventPosition();
                    }}
                    style={{
                      filter: `contrast(${contrastVal - 50}%) brightness(${
                        brightnessVal - 50
                      }%)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Col>
        {!isManual && (
          <Col sm={2}>
            <Button
              variant="success"
              onClick={(e) => {
                setDisable(!disable);
                Array.from(
                  document.getElementsByClassName('form-check-input'),
                ).forEach((item) => {
                  // eslint-disable-next-line no-param-reassign
                  item.checked = false;
                });
                // eslint-disable-next-line no-unused-expressions
                disable ? onClickFinishButton(e) : setStarPos(originalStarPos);
              }}
              className="mb-3 p-3"
            >
              {disable ? '再描画' : 'やり直す'}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onClickFinishButton();
                handleClick();
              }}
              className="mb-3 p-3"
              disabled={disable}
            >
              探索終了
            </Button>
            <StarsList disable={disable} />
          </Col>
        )}
      </Row>
      <LoadingButton loading={loading} />
    </Container>
  );
}


export default PanZoom;
