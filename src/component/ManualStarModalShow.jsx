import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MousePositionContext, PageContext } from './context';
import useEventListener from '../hooks/useEventListener';

function ManualStarModal({
  manualStarModalShow,
  onHide,
  defaultZoomRate,
  imageURLs,
  activeKey,
  setPositionList,
  onClickNext,
  onClickRetry,
}) {
  const [context, setContext] = useState();
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const [canvasManualRectangleCoordinates, setCanvasManualRectanglCoordinates] =
    useState([]);
  const [centerCoordinate, setCenterCoodinate] = useState(null);

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

    context.beginPath();
    context.arc(rectPos4.x, rectPos4.y, 10, 0, Math.PI * 2, false);
    context.fill();
    context.strokeStyle = 'gray';

    context.stroke();

    setPositionList((prevPositionList) => {
      const prevPositionListCopy = [...prevPositionList];
      const activeArray = prevPositionListCopy[activeKey];
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
      const targetIndex = activeArray.findIndex(
        (activeElement) => activeElement.page === currentPage,
      );
      if (targetIndex === -1) {
        prevPositionListCopy[activeKey].splice(currentPage, 0, value);
      } else {
        prevPositionListCopy[activeKey].splice(targetIndex, 1, value);
      }

      return prevPositionListCopy;
    });

    const finalCoordinates = [rectPos1, rectPos2, rectPos3, rectPos4];
    context.fillStyle = 'red';
    context.strokeStyle = 'red';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      context.lineWidth = 10;
      context.beginPath();
      context.moveTo(finalCoordinates[i].x, finalCoordinates[i].y);
      context.lineTo(finalCoordinates[i + 1].x, finalCoordinates[i + 1].y);
      context.stroke();
    }
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(rectPos4.x, rectPos4.y);
    context.lineTo(rectPos1.x, rectPos1.y);
    context.stroke();
  }

  function drawDot() {
    if (!context) {
      return;
    }
    // rectangle setting
    const coordinate = currentMousePos;
    setCanvasManualRectanglCoordinates([
      ...canvasManualRectangleCoordinates,
      coordinate,
    ]);
    canvasManualRectangleCoordinates.push(coordinate);
    context.beginPath();
    context.arc(coordinate.x, coordinate.y, 10, 0, Math.PI * 2, false);
    context.fillStyle = 'red';
    context.strokeStyle = 'red';
    context.fill();
    context.stroke();

    const cmrcLength = canvasManualRectangleCoordinates.length;
    if (cmrcLength === 3) {
      getForthPoint(canvasManualRectangleCoordinates);
    }
  }

  const drawImage = () => {
    if (context) {
      const img = imageURLs[currentPage].nomasked
        ? window.images[currentPage][1]
        : window.images[currentPage][0];
      context.imageSmoothingEnabled = false;

      const imageZoomCenter =
        centerCoordinate === null ? currentMousePos : centerCoordinate;

      if (centerCoordinate === null) {
        setCenterCoodinate({
          x: currentMousePos.x,
          y: currentMousePos.y,
        });
      }

      context.drawImage(
        img,
        imageZoomCenter.x - defaultZoomRate / 2,
        imageZoomCenter.y - defaultZoomRate / 2,
        defaultZoomRate,
        defaultZoomRate,
        0,
        0,
        500,
        500,
      );
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasContext = canvas.getContext('2d');
      setContext(canvasContext);
    }
  });

  // imageの描画
  useEffect(() => {
    drawImage();
  }, [context]);

  function relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const scaleX = event.target.width / bounds.width; // relationship bitmap vs. element for X
    const scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

    const x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
    const y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

    setCurrentMousePos({ x: parseInt(x, 10), y: parseInt(y, 10) });
  }
  useEventListener('mousemove', relativeCoords, canvasRef.current);

  return (
    <Modal
      show={manualStarModalShow}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      onExit={() => {
        setCanvasManualRectanglCoordinates([]);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          3点を入力してください
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <canvas
            ref={canvasRef}
            style={{
              imageRendering: 'pixelated',
            }}
            width="500px"
            height="500px"
            onClick={
              canvasManualRectangleCoordinates.length === 3
                ? () => {}
                : () => drawDot()
            }
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={() => {
            onClickRetry();
            drawImage();
            setCanvasManualRectanglCoordinates([]);
          }}
        >
          やり直す
        </Button>
        <Button
          variant="success"
          disabled={canvasManualRectangleCoordinates.length !== 3}
          onClick={() => {
            onClickNext();
            setCanvasManualRectanglCoordinates([]);
            setCenterCoodinate(null);
          }}
        >
          完了
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ManualStarModal;

ManualStarModal.propTypes = {
  manualStarModalShow: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  defaultZoomRate: PropTypes.number.isRequired,
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeKey: PropTypes.number.isRequired,
  setPositionList: PropTypes.arrayOf(PropTypes.array).isRequired,
  onClickNext: PropTypes.func.isRequired,
  onClickRetry: PropTypes.func.isRequired,
};
