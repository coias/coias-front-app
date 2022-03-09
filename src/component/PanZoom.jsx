// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState } from 'react';
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

function PanZoom({ activateGrab, activateScroll }) {
  const ZPCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);
  const [contrastVal, setContrastVal] = useState(50);
  const [brightnessVal, setBrightnessVal] = useState(50);
  const [imageURLs, setImageURLs] = useState([]);
  const { setCurrentMousePos } = useContext(MousePositionContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  const getGrab = () => activateGrab;

  const getScroll = () => activateScroll;

  useEffect(() => {
    const ZPCanvas = panzoom(ZPCanvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 1.0,
      // autocenter: true,
      beforeWheel(e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        const shouldIgnore = !getScroll();
        console.log(e);
        return shouldIgnore;
      },
      beforeMouseDown() {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        const shouldIgnore = !getGrab();
        console.log(getGrab());
        return shouldIgnore;
      },
    });

    return () => {
      ZPCanvas.dispose();
    };
  }, [activateGrab, activateScroll]);

  useEffect(() => {
    // disp.txtを取得
    const getDisp = async () => {
      const response = await axios.get(`${reactApiUri}disp`);
      const disp = await response.data.result;
      setStarPos(disp);
    };
    // nginxにある画像を全て取得
    const getImages = async () => {
      const response = await axios.get(`${reactApiUri}public_images`);
      const dataList = await response.data.result.sort();
      const urlList = dataList
        .filter((e) => e.endsWith('disp-coias_nonmask.png'))
        .map((e) => nginxApiUri + e);
      setImageURLs(urlList);
    };

    // 初回load時のみ実行
    if (starPos.length === 0) {
      getDisp();
      getImages();
    }
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (context && starPos.length > 0) {
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
  }, [starPos, currentPage]);

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
            <div ref={ZPCanvasRef}>
              <canvas
                ref={canvasRef}
                width="1050px"
                height="1050px"
                style={{
                  filter: `contrast(${contrastVal + 50}%) brightness(${
                    brightnessVal + 50
                  }%)`,
                }}
                activate={activateScroll}
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
  activateGrab: PropTypes.bool.isRequired,
  activateScroll: PropTypes.bool.isRequired,
};

export default PanZoom;
