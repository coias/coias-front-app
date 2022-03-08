import React, { useRef, useEffect, useContext, useState } from "react";
import _ from "lodash";
import panzoom from "panzoom";
import { PageContext, MousePositionContext, StarPositionContext } from "../App";
import ContrastBar from "./ContrastBar";
import BrightnessBar from "./BrightnessBar";
import axios from "axios";
import StarsList from "./starsList";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import MousePosition from "./MousePosition";

const PanZoom = () => {
  const z_p_canvasRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [contrastVal, setContrastVal] = useState(50);
  const [brightnessVal, setBrightnessVal] = useState(50);
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const uri = process.env.REACT_APP_API_URI;

  useEffect(() => {
    const z_p_canvas = panzoom(z_p_canvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 1.0,
      //autocenter: true,
      beforeWheel: function (e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
      beforeMouseDown: function (e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.shiftKey;
        return shouldIgnore;
      },
    });

    return () => {
      z_p_canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const getDisp = async () => {
      const response = await axios.get(uri + "disp");
      const disp = await response.data.split(/\n/);
      setStarPos(disp.map(d =>{
        const array = d.split(" ");
        array.push(false);
        return array;
      }));
      //console.log("getDisp called")
    };
    if(starPos.length === 0) getDisp();
  }, [currentPage]);

  //console.log(starPos);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setLoaded(false);

    if (context && starPos.length > 0) {
      const storedTransform = context.getTransform();
      context.canvas.width = context.canvas.width;
      context.setTransform(storedTransform);
      const img = new Image();
      
      img.onload = () => {
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        starPos.forEach((pos) => {
          if (pos[1] === String(currentPage)) {
            const x = parseFloat(pos[2]) - 20;
            const y = img.naturalHeight - parseFloat(pos[3]) + 20;
            context.lineWidth = 2;
            //set stroke style depends on pos[4]
            context.strokeStyle = pos[4] ? "red" : "black";

            context.rect(x, y, 40, 40);

            context.font = "15px serif";
            context.fillStyle = "red";
            context.fillText(pos[0], x - 20, y - 10);
            context.stroke();
            setLoaded(true);
          }
        });
      };

      img.src =
        "./images/" + String(currentPage + 1) + "_disp-coias_nonmask.png";  

    }
  }, [starPos, currentPage]);

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
    <Container fluid>
      <Row>
        <Col sm={10}>
          <Scrollbars
            style={{
              width: "100%",
              height: "80vh",
              overflow: "hidden",
              backgroundColor: "gray",
              position: "relative",
            }}
          >
            <div ref={z_p_canvasRef}>
              <canvas
                ref={canvasRef}
                width="1050px"
                height="1050px"
                style={{
                  filter:
                    "contrast(" +
                    (contrastVal + 50) +
                    "%) brightness(" +
                    (brightnessVal + 50) +
                    "%)",
                }}
              />
            </div>
            <MousePosition />
            <ContrastBar val={contrastVal} set={setContrastVal} />
            <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
          </Scrollbars>
        </Col>
        <Col sm={2}>
          <StarsList starPos={starPos} setStarPos={setStarPos} currentPage={currentPage} />
        </Col>
      </Row>
    </Container>
  );
};

export default PanZoom;
