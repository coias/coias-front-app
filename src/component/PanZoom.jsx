import React, { useRef, useEffect, useContext, useState } from 'react';
import panzoom from 'panzoom';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import StarsList from './StarsList';
import { PageContext, MousePositionContext } from './Context';

function PanZoom() {
  const ZoomPanCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [setLoaded] = useState(false);
  const { currentPage } = useContext(PageContext);
  const { setCurrentMousePos } = useContext(MousePositionContext);

  const [contrastVal, setContrastVal] = useState(100);
  const [brightnessVal, setBrightnessVal] = useState(100);

  useEffect(() => {
    const ZoomPanCanvas = panzoom(ZoomPanCanvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 1.0,
      // autocenter: true,
      beforeWheel(e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        const shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
      beforeMouseDown(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        const shouldIgnore = !e.shiftKey;
        return shouldIgnore;
      },
    });

    return () => {
      ZoomPanCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    const getDisp = async () => {
      const response = await axios.get('http://127.0.0.1:8000/disp');
      const disp = await response.data.result;
      setPositions(disp);
    };
    getDisp();
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (context && positions.length > 0) {
      const storedTransform = context.getTransform();
      // context.canvas.width = context.canvas.width;
      context.setTransform(storedTransform);
      const img = new Image();
      img.src = `./images/${String(currentPage + 1)}_disp-coias_nonmask.png`;

      img.onload = () => {
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        positions.forEach((pos) => {
          if (pos[1] === String(currentPage)) {
            const x = parseFloat(pos[2]) - 20;
            const y = img.naturalHeight - parseFloat(pos[3]) + 20;
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.rect(x, y, 40, 40);

            context.font = '15px serif';
            context.fillStyle = 'red';
            context.fillText(pos[0], x - 20, y - 10);
            context.stroke();
            setLoaded(true);
          }
        });
      };
    }
  }, [positions]);

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
    // return canvasElem.addEventListener('mousemove', relativeCoords)
  }, []);

  return (
    <Container fluid style={{ marginTop: '80px' }}>
      <Row>
        <Col sm={8}>
          <Scrollbars
            style={{
              width: 900,
              height: 900,
              overflow: 'hidden',
              backgroundColor: 'black',
            }}
          >
            <div ref={ZoomPanCanvasRef}>
              <canvas
                ref={canvasRef}
                width="1100px"
                height="1100px"
                style={{
                  filter: `contrast(${contrastVal}%) brightness(${brightnessVal}%)`,
                }}
              />
            </div>
          </Scrollbars>
          <>
            <Form.Label>Contrast</Form.Label>
            <Form.Range
              value={contrastVal}
              onChange={(e) => setContrastVal(Number(e.target.value))}
            />
          </>
          <>
            <Form.Label>Blightness</Form.Label>
            <Form.Range
              value={brightnessVal}
              onChange={(e) => setBrightnessVal(Number(e.target.value))}
            />
          </>
        </Col>
        <Col sm={4}>
          <StarsList positions={positions} currentPage={currentPage} />
        </Col>
      </Row>
    </Container>
  );
}

export default PanZoom;
