import React, { useRef, useEffect, useContext, useState } from "react";
import Draggable from "react-draggable";
import * as R from "ramda";
import _ from "lodash";
import panzoom from "panzoom";
import { PageContext, MousePositionContext } from "../App";
import axios from "axios";
import StarsList from "./starsList";
import { Container, Row, Col, Form } from "react-bootstrap";

const canvasSize = 1050;

const zoomBy = 0.1;

const _bg = {
  direction: 45,
  color: {
    dark: "#ccc",
    light: "transparent",
  },
  size: 20,
  span: 100 / 4,
};

const bg = { ..._bg, doubleSize: _bg.size * 2, rest: 100 - _bg.span };

const PanZoom = () => {
  const z_p_canvasRef = useRef(null);
  const canvasRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);

    const [contrastVal, setContrastVal] = useState(100);
	const [brightnessVal, setBrightnessVal] = useState(100);

  useEffect(() => {
    const z_p_canvas = panzoom(z_p_canvasRef.current, {
      // maxZoom: 10,
      // minZoom: 1,
      // autocenter: true,
    });

    return () => {
      z_p_canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const getDisp = async () => {
      const response = await axios.get("http://127.0.0.1:8000/disp");
      const disp = await response.data.result;
      setPositions(disp);
    };
    getDisp();
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (context && positions.length > 0) {
      const storedTransform = context.getTransform();
      context.canvas.width = context.canvas.width;
      context.setTransform(storedTransform);
      const img = new Image();
      img.src =
        "./images/" + String(currentPage + 1) + "_disp-coias_nonmask.png";

      img.onload = () => {
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        positions.forEach((pos) => {
          if (pos[1] === String(currentPage)) {
            const x = parseFloat(pos[2]) - 20;
            const y = img.naturalHeight - parseFloat(pos[3]) + 20;
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.rect(x, y, 40, 40);

            context.font = "15px serif";
            context.fillStyle = "red";
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
      var bounds = event.target.getBoundingClientRect(),
        scaleX = event.target.width / bounds.width, // relationship bitmap vs. element for X
        scaleY = event.target.height / bounds.height; // relationship bitmap vs. element for Y

      var x = (event.clientX - bounds.left) * scaleX; // scale mouse coordinates after they have
      var y = (event.clientY - bounds.top) * scaleY; // been adjusted to be relative to element

      setCurrentMousePos({ x: parseInt(x), y: parseInt(y) });
    }

    canvasElem.addEventListener("mousemove", relativeCoords);
    return () => {
      canvasElem.addEventListener("mousemove", relativeCoords);
    };
  }, []);

  return (
    <Container fluid style={{marginTop: "80px"}}>
      <Row>
        <Col sm={8}>
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div ref={z_p_canvasRef}>
              <canvas ref={canvasRef} 
                width="1100px" height="1100px" 
                style={{
                  filter: `contrast(${contrastVal}%) brightness(${brightnessVal}%)`
                }}
              />
            </div>
          </div>
          <>
            <Form.Label>Contrast</Form.Label>
            <Form.Range onChange={(e) => setContrastVal(Number(e.target.value))} />
          </>
          <>
            <Form.Label>Blightness</Form.Label>
            <Form.Range onChange={(e) => setBrightnessVal(Number(e.target.value))} />
          </>
        </Col>

          <StarsList positions={positions} currentPage={currentPage} />
      </Row>
    </Container>
  );
};

export default PanZoom;
