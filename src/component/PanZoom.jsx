// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState, useMemo } from 'react';
import panzoom from 'panzoom';
import axios from 'axios';
// eslint-disable-next-line object-curly-newline
import { Container, Row, Col, Button } from 'react-bootstrap';
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

function PanZoom({ imageURLs }) {
  const ZPCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);
  const [contrastVal, setContrastVal] = useState(150);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [clickedStarPos, setClickedStarPos] = useState([]);
  const { setCurrentMousePos } = useContext(MousePositionContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const reactApiUri = process.env.REACT_APP_API_URI;

  const ZPCanvas = useRef(null);

  const [isGrab, setIsGrab] = useState('');

  // panzoomのコンストラクター
  useEffect(() => {
    ZPCanvas.current = panzoom(ZPCanvasRef.current, {
      maxZoom: 10,
      minZoom: 1,
      bounds: true,
      boundsPadding: 1.0,
      zoomDoubleClickSpeed: 1,
      beforeMouseDown() {
        // スクロールされる前にisGrabの値を確認
        const val = document.getElementById('grabButton').dataset.active;
        setIsGrab(val);
        const shouldIgnore = !(val === 'true');
        return shouldIgnore;
      },
    });

    return () => {
      ZPCanvas.current.dispose();
    };
  }, []);

  // 初回のみのAPIの読み込み
  useMemo(() => {
    // disp.txtを取得
    const getDisp = async () => {
      const response = await axios.get(`${reactApiUri}disp`);
      const disp = await response.data.result;
      disp.forEach((e) => {
        e.push(false);
      });
      setStarPos(disp);
    };

    getDisp();
  }, []);

  // 探索終了ボタンが押された時の処理
  const onClickFinishButton = async () => {
    // memo.txtへの出力
    const selectedStars = starPos
      .filter((pos) => parseInt(pos[1], 10) === 0 && pos[4])
      .map((e) => e[0].substring(1));
    await axios.put(`${reactApiUri}memo`, selectedStars);

    // prempedit
    await axios.put(`${reactApiUri}prempedit`);

    // prempedit3
    let s = selectedStars[selectedStars.length - 1];
    while (s.charAt(0) === '0') {
      s = s.substring(1);
    }
    const num = String(parseInt(s, 10) + 1);
    await axios.put(`${reactApiUri}prempedit3?num=${num}`);

    // /redisp
    const response = await axios.put(`${reactApiUri}redisp`);
    const redisp = await response.data.result;
    redisp.forEach((e) => {
      e.push(false);
    });
    setStarPos(redisp);

    // rename
    await axios.put(`${reactApiUri}rename`);
  };

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
  useMemo(() => {
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }

    function changeColorOnClick(event) {
      const rect = event.target.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      function testHit(thisx, thisy) {
        const starx = thisx - 20;
        const stary = 1050 - thisy + 20;
        return (
          // eslint-disable-next-line operator-linebreak
          starx <= point.x &&
          // eslint-disable-next-line operator-linebreak
          point.x <= starx + 40 &&
          // eslint-disable-next-line operator-linebreak
          stary <= point.y &&
          point.y <= stary + 40
        );
      }

      const newStarPos = starPos.map((item) => {
        if (testHit(parseInt(item[2], 10), parseInt(item[3], 10))) {
          const checked = !item[4];
          const newOriginalPos = [];
          newOriginalPos.push(item[0]);
          newOriginalPos.push(item[1]);
          newOriginalPos.push(item[2]);
          newOriginalPos.push(item[3]);
          newOriginalPos.push(checked);
          return newOriginalPos;
        }
        return item;
      });

      setClickedStarPos(newStarPos);
      clickedStarPos.fill();
    }

    if (isGrab === 'true') {
      canvasElem.removeEventListener('click', changeColorOnClick);
      return;
    }

    canvasElem.addEventListener('click', changeColorOnClick);
  }, [starPos]);

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

  return (
    <Container fluid>
      <Row>
        <Col sm={10}>
          <div
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
              }}
            >
              <canvas
                ref={canvasRef}
                width="1050px"
                height="1050px"
                style={{
                  filter: `contrast(${contrastVal - 50}%) brightness(${
                    brightnessVal - 50
                  }%)`,
                }}
              />
            </div>
            <MousePosition />
            <ContrastBar val={contrastVal} set={setContrastVal} />
            <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
          </div>
        </Col>
        <Col sm={2}>
          <Button
            variant="danger"
            onClick={() => {
              onClickFinishButton();
            }}
            className="mb-3 p-3"
          >
            探索終了
          </Button>
          <StarsList />
        </Col>
      </Row>
    </Container>
  );
}

PanZoom.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PanZoom;
