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
  const RECT_WIDTH = 40;
  const RECT_HEIGHT = 40;
  const [IMAGE_WIDTH, setImageWidth] = useState(0);
  const [IMAGE_HEIGHT, setImageHeight] = useState(0);

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
    // unknown_disp.txtを取得
    const getDisp = async () => {
      const response = await axios.get(`${reactApiUri}unknown_disp`);
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
        setImageHeight(img.naturalHeight);
        setImageWidth(img.naturalWidth);
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        starPos.forEach((pos) => {
          if (pos[1] === String(currentPage)) {
            const x = parseFloat(pos[2]) - RECT_WIDTH / 2;
            const y = img.naturalHeight - parseFloat(pos[3]) + RECT_WIDTH / 2;
            context.lineWidth = 2;
            // set stroke style depends on pos[4]
            context.strokeStyle = pos[4] ? 'red' : 'black';
            context.strokeRect(x, y, RECT_WIDTH, RECT_HEIGHT);
            context.font = '15px serif';
            context.fillStyle = 'red';
            context.fillText(pos[0], x - RECT_WIDTH / 2, y - RECT_HEIGHT / 3);
            context.stroke();
          }
        });
      };
      img.src = imageURLs[currentPage];
    }
  }, [currentPage, starPos, imageURLs]);

  // マウスクリックに関する処理
  useEffect(() => {
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }

    // クリック時に色を変化させるイベントリスナー
    function changeColorOnClick(event) {
      console.log('Hello');
      // canvas自体の大きさを取得
      const rect = event.target.getBoundingClientRect();
      // canvas上でのクリック位置をObjectで保持
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      // 当たり判定を検出
      function testHit(thisx, thisy) {
        const starx = thisx - RECT_WIDTH / 2;
        const stary = IMAGE_HEIGHT - thisy + RECT_HEIGHT / 2;
        return (
          // eslint-disable-next-line operator-linebreak
          starx <= point.x &&
          // eslint-disable-next-line operator-linebreak
          point.x <= starx + RECT_WIDTH &&
          // eslint-disable-next-line operator-linebreak
          stary <= point.y &&
          point.y <= stary + RECT_HEIGHT
        );
      }

      // 当たり判定のあった天体を新しくstarPosに上書きする
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

    const isGrab = document.getElementById('grabButton').dataset.active;
    const isSelect = document.getElementById('selectButton').dataset.active;

    canvasElem.addEventListener('click', changeColorOnClick);

    if (isGrab === 'true' || isSelect === 'false') {
      canvasElem.removeEventListener('click', changeColorOnClick);
    }
  }, []);

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
                width={`${IMAGE_WIDTH}px`}
                height={`${IMAGE_HEIGHT}px`}
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
