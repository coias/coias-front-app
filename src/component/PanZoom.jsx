// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState, useMemo } from 'react';
import panzoom from 'panzoom';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import {
  PageContext,
  MousePositionContext,
  StarPositionContext,
} from './context';
import ContrastBar from './ContrastBar';
import BrightnessBar from './BrightnessBar';
import StarsList from './StarsList';
import MousePosition from './MousePosition';

function PanZoom({ isGrab, isScroll, imageURLs }) {
  const ZPCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);
  const [contrastVal, setContrastVal] = useState(50);
  const [brightnessVal, setBrightnessVal] = useState(50);
  const { setCurrentMousePos } = useContext(MousePositionContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const reactApiUri = process.env.REACT_APP_API_URI;

  // panzoomのコンストラクター
  useEffect(() => {
    const ZPCanvas = panzoom(ZPCanvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 1.0,
      zoomDoubleClickSpeed: 1,
      // autocenter: true,
      beforeWheel() {
        // スクロールされる前にisScrollの値を確認
        const shouldIgnore = !isScroll;
        return shouldIgnore;
      },
      beforeMouseDown() {
        // スクロールされる前にisGrabの値を確認
        const shouldIgnore = !isGrab;
        return shouldIgnore;
      },
    });

    return () => {
      ZPCanvas.dispose();
    };
  }, [isGrab, isScroll]);

  // 初回のみのAPIの読み込み
  useMemo(() => {
    // disp.txtを取得
    const getDisp = async () => {
      const response = await axios.get(`${reactApiUri}disp`);
      const disp = await response.data.result;
      setStarPos(disp);
    };

    getDisp();
  }, []);

  // imageの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (context && starPos.length > 0 && imageURLs.length > 0) {
      const w = canvas.width;
      canvas.width = w;
      const img = new Image();

      img.onload = () => {
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        starPos.forEach((pos) => {
          if (pos[1] === String(currentPage)) {
            const x = parseFloat(pos[2]) - 20;
            const y = img.naturalHeight - parseFloat(pos[3]) + 20;
            context.lineWidth = 2;
            // set stroke style depends on pos[4]
            context.strokeStyle = pos[4] ? 'red' : 'black';
            context.strokeRect(x, y, 40, 40);
            context.font = '15px serif';
            context.fillStyle = 'red';
            context.fillText(pos[0], x - 20, y - 10);
            context.stroke();
          }
        });
      };
      img.src = imageURLs[currentPage];
    }
  }, [currentPage, starPos, imageURLs]);

  // add event listener on canvas for mouse position
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

  return (
    <Container fluid>
      <Row>
        <Col sm={10}>
          <Scrollbars
            style={{
              width: '100%',
              height: '80vh',
              overflow: 'hidden',
              backgroundColor: 'gray',
              position: 'relative',
            }}
          >
            <div
              ref={ZPCanvasRef}
              style={{
                width: '100%',
                height: '80vh',
                overflow: 'hidden',
                backgroundColor: 'gray',
                position: 'relative',
              }}
            >
              <canvas
                ref={canvasRef}
                width="1050px"
                height="1050px"
                style={{
                  filter: `contrast(${contrastVal + 50}%) brightness(${
                    brightnessVal + 50
                  }%)`,
                }}
              />
            </div>
            <MousePosition />
            <ContrastBar val={contrastVal} set={setContrastVal} />
            <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
          </Scrollbars>
        </Col>
        <Col sm={2}>
          <StarsList />
        </Col>
      </Row>
    </Container>
  );
}

PanZoom.propTypes = {
  isGrab: PropTypes.bool.isRequired,
  isScroll: PropTypes.bool.isRequired,
  imageURLs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PanZoom;
