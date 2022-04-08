import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import axios from 'axios';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';
import ContrastBar from '../component/ContrastBar';
import BrightnessBar from '../component/BrightnessBar';
import { StarPositionContext, PageContext } from '../component/context';

function COIAS() {
  const [isGrab, setIsGrab] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [imageURLs, setImageURLs] = useState([]);
  const [originalStarPos, setOriginalStarPos] = useState({});
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { setCurrentPage } = useContext(PageContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
  useEffect(() => {
    setIsGrab(true);
    const toObjectArray = [];

    // nginxにある画像を全て取得
    const getImages = async () => {
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();

      await dataList.forEach((data) => {
        const idx = data.slice(0, 2);
        const o =
          toObjectArray.filter((obj) => obj.name.startsWith(idx))[0] ?? {};
        if (toObjectArray.indexOf(o) === -1) {
          toObjectArray.push(o);
        }
        if (data.endsWith('disp-coias.png')) {
          o.name = data;
          o.mask = nginxApiUri + data;
        } else {
          o.nomask = nginxApiUri + data;
        }
        o.visible = true;
        o.nomasked = false;
      });
      setImageURLs(toObjectArray);
    };

    getImages();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
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

    window.images = [];
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

    setCurrentPage(0);
  }, [imageURLs, isReload]);

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

  return (
    <div className="coias-view-main">
      <PlayMenu imageNames={imageURLs} setImageURLs={setImageURLs} />
      <Container fluid>
        <Row>
          <Col>
            <div
              className="flex-column"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Button
                id="grabButton"
                data-active={isGrab}
                variant={isGrab ? 'danger' : 'light'}
                onClick={() => {
                  setIsSelect(false);
                  setIsGrab(!isGrab);
                }}
              >
                <FaHandPaper size={30} />
              </Button>
              <Button
                id="selectButton"
                data-active={isSelect}
                variant={isSelect ? 'danger' : 'light'}
                onClick={() => {
                  setIsGrab(false);
                  setIsSelect(!isSelect);
                }}
              >
                <FaMousePointer size={30} />
              </Button>
              <Button
                id="reloadButton"
                variant="light"
                onClick={() => {
                  setIsGrab(false);
                  setIsSelect(false);
                  Array.from(
                    document.getElementsByClassName('form-check-input'),
                  ).forEach((item) => {
                    // eslint-disable-next-line no-param-reassign
                    item.checked = false;
                  });
                  setIsGrab(true);
                  setIsReload(!isReload);
                }}
              >
                <AiOutlineReload size={30} />
              </Button>
              <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
              <ContrastBar val={contrastVal} set={setContrastVal} />
            </div>
          </Col>
          <Col md={11} className="h-100">
            <PanZoom
              imageURLs={imageURLs}
              isReload={isReload}
              brightnessVal={brightnessVal}
              contrastVal={contrastVal}
              onClickFinishButton={onClickFinishButton}
              originalStarPos={originalStarPos}
              starPos={starPos}
              setStarPos={setStarPos}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default COIAS;
