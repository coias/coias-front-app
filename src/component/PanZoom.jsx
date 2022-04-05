// eslint-disable-next-line object-curly-newline
import React, { useRef, useEffect, useContext, useState } from 'react';
import panzoom from 'panzoom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line object-curly-newline
import { Container, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  PageContext,
  MousePositionContext,
  StarPositionContext,
} from './context';
import LoadingButton from './LoadingButton';

import StarsList from './StarsList';
import MousePosition from './MousePosition';

function PanZoom({ imageURLs, isReload, brightnessVal, contrastVal }) {
  if (window.hitIndex === undefined) {
    window.hitIndex = '';
  }
  if (!window.images) {
    window.images = [];
    window.imageLoadComplete = false;
  }
  const ZPCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentPage } = useContext(PageContext);
  const [disable, setDisable] = useState(true);
  const [originalStarPos, setOriginalStarPos] = useState({});
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/Report');
  };
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const reactApiUri = process.env.REACT_APP_API_URI;

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
      minZoom: 0.6,
      bounds: true,
      boundsPadding: 0.05,
      zoomDoubleClickSpeed: 1,
      beforeWheel(e) {
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

    return () => {
      ZPCanvas.current.dispose();
    };
  }, [isReload]);

  // 探索終了ボタンが押された時の処理
  const onClickFinishButton = async () => {
    // memo.txtへの出力
    const selectedStars = Object.keys(starPos)
      .map((key) => starPos[key])
      .filter((item) => item.isSelected)
      .map((item) => item.name.substring(1));
    await axios.put(`${reactApiUri}memo`, selectedStars);

    // prempedit
    await axios.put(`${reactApiUri}prempedit`);

    // prempedit3
    let s = selectedStars[selectedStars.length - 1];
    while (s.charAt(0) === '0') {
      s = s.substring(1);
    }
    const num = '1';
    await axios.put(`${reactApiUri}prempedit3?num=${num}`);

    // redisp
    const response = await axios.put(`${reactApiUri}redisp`);
    const redisp = await response.data.result;

    // 選択を同期させるため、オブジェクトに変更
    const toObject = {};
    redisp.forEach((item) => {
      let star = toObject[item[0]];
      if (!star) {
        toObject[item[0]] = {
          name: item[0],
          page: [null, null, null, null, null],
          isSelected: false,
        };
        star = toObject[item[0]];
      }
      star.page[item[1]] = {
        name: item[0],
        x: parseFloat(item[2], 10),
        y: parseFloat(item[3], 10),
      };
    });

    setStarPos(toObject);

    // rename
    await axios.put(`${reactApiUri}rename`);
  };

  // 画面表示時、１回だけ処理
  useEffect(() => {
    // unknown_disp.txtを取得
    const getDisp = async () => {
      const response = await axios.get(`${reactApiUri}unknown_disp`);
      const disp = await response.data.result;
      const starPosLength = Object.keys(starPos).length;

      // H00000の座標で、同じdispかどうかを判定
      const isSameObj = () => {
        let flag = false;
        if (starPosLength === 0) return null;
        starPos[Object.keys(starPos)[0]].page.forEach((pos, index) => {
          const dispEl = {
            x: parseFloat(disp[index][2], 10),
            y: parseFloat(disp[index][3], 10),
          };
          // console.log(dispEl.x, dispEl.y, pos.x, pos.y);
          if (dispEl.x === pos.x && dispEl.y === pos.y) flag = true;
        });
        return flag;
      };

      // console.log(isSameObj());
      // console.log(imageURLs, imageURLs.length);
      // console.log(disp, disp.length);

      // 選択を同期させるため、オブジェクトに変更
      // 二回目以降 (isSameObj())
      // 初回 && 同画面遷移 (else)
      const toObject = {};

      if (isSameObj()) {
        setStarPos(starPos);
        setOriginalStarPos(starPos);
      } else {
        disp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: [null, null, null, null, null],
              isSelected: false,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
        setStarPos(toObject);
        setOriginalStarPos(toObject);
      }
    };

    window.images = imageURLs.map((image) => {
      const masked = new Image();
      const nomasked = new Image();
      const onLoad = () => {
        window.imageLoadComplete =
          window.images.filter(
            (i) =>
              i[0].complete &&
              i[0].naturalWidth !== 0 &&
              i[1].complete &&
              i[1].naturalWidth !== 0,
          ).length === window.images.length;
        if (window.imageLoadComplete) {
          getDisp();
        }
      };
      masked.onload = onLoad;
      nomasked.onload = onLoad;
      masked.src = image.mask;
      nomasked.src = image.nomask;
      return [masked, nomasked];
    });
  }, [imageURLs, isReload]);

  // imageの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (
      context &&
      Object.keys(starPos).length > 0 &&
      window.images.length !== 0 &&
      window.imageLoadComplete
    ) {
      setLoading(true);

      const w = canvas.width;
      canvas.width = w;
      const img = imageURLs[currentPage].nomasked
        ? window.images[currentPage][1]
        : window.images[currentPage][0];

      setImageHeight(img.naturalHeight);
      setImageWidth(img.naturalWidth);
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
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
      setLoading(false);
    }
  }, [currentPage, starPos, isReload, IMAGE_HEIGHT]);

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
    if (document.getElementById('selectButton').dataset.active !== 'true') {
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
        const position = item.page[currentPage];
        if (position && testHit(position.x, position.y)) {
          newStarPos[item.name].isSelected = !item.isSelected;
          document.getElementById(item.name).checked =
            newStarPos[item.name].isSelected;
        }
      });
    setStarPos(newStarPos);
  }

  return (
    <Container fluid>
      <Row className="star-canvas-container">
        <Col sm={10}>
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
              <div className="canvas-wapper" ref={ZPCanvasRef}>
                <canvas
                  ref={canvasRef}
                  width={`${IMAGE_WIDTH}px`}
                  height={`${IMAGE_HEIGHT}px`}
                  onClick={(e) => {
                    changeColorOnClick(e);
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
            disabled={disable}
            variant="danger"
            onClick={(e) => {
              onClickFinishButton(e);
              handleClick();
            }}
            className="mb-3 p-3"
          >
            探索終了
          </Button>
          <StarsList />
        </Col>
      </Row>
      <LoadingButton loading={loading} />
    </Container>
  );
}

PanZoom.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  isReload: PropTypes.bool.isRequired,
  brightnessVal: PropTypes.number.isRequired,
  contrastVal: PropTypes.number.isRequired,
};

export default PanZoom;
