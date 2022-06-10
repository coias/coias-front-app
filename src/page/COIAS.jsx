import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';
import { StarPositionContext, PageContext } from '../component/context';
import COIASToolBar from '../component/COIASToolBar';
import LoadingButton from '../component/LoadingButton';

// eslint-disable-next-line no-use-before-define
COIAS.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  setOriginalStarPos: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
};

function COIAS({
  imageURLs,
  setImageURLs,
  originalStarPos,
  setOriginalStarPos,
  intervalRef,
}) {
  const [isSelect, setIsSelect] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [loading, setLoading] = useState(false);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { setCurrentPage } = useContext(PageContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
  useEffect(() => {
    const toObjectArray = [];
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
    // nginxにある画像を全て取得
    const getImages = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    getImages();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
    // unknown_disp.txtを取得
    const getDisp = async () => {
      setLoading(true);

      const res1 = await axios.get(`${reactApiUri}unknown_disp`);
      const unknownDisp = await res1.data.result;
      const toObject = {};

      // 選択を同期させるため、オブジェクトに変更
      unknownDisp.forEach((item) => {
        let star = toObject[item[0]];
        if (!star) {
          toObject[item[0]] = {
            name: item[0],
            page: [null, null, null, null, null],
            isSelected: false,
            isKnown: false,
          };
          star = toObject[item[0]];
        }
        star.page[item[1]] = {
          name: item[0],
          x: parseFloat(item[2], 10),
          y: parseFloat(item[3], 10),
        };
      });

      const res2 = await axios
        .get(`${reactApiUri}karifugo_disp`)
        .catch(() => {});
      const res3 = await axios
        .get(`${reactApiUri}numbered_disp`)
        .catch(() => {});
      if (res2 !== undefined) {
        const knownDisp = await res2.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: [null, null, null, null, null],
              isSelected: false,
              isKnown: true,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
      }
      if (res3 !== undefined) {
        const knownDisp = await res3.data.result;
        knownDisp.forEach((item) => {
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: [null, null, null, null, null],
              isSelected: false,
              isKnown: true,
            };
            star = toObject[item[0]];
          }
          star.page[item[1]] = {
            name: item[0],
            x: parseFloat(item[2], 10),
            y: parseFloat(item[3], 10),
          };
        });
      }

      setStarPos(toObject);
      setOriginalStarPos(toObject);
      setLoading(false);
    };

    window.images = [];
    window.images = imageURLs.map((image) => {
      setLoading(true);
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
      masked.src = `${image.mask}?${new Date().getTime()}`;
      nomasked.src = `${image.nomask}?${new Date().getTime()}`;
      setLoading(false);

      return [masked, nomasked];
    });

    setCurrentPage(0);
  }, [imageURLs, isReload]);

  // 探索終了ボタンが押された時の処理
  const onClickFinishButton = async (num) => {
    // memo.txtへの出力
    const selectedStars = Object.keys(starPos)
      .map((key) => starPos[key])
      .filter((item) => item.isSelected)
      .map((item) => item.name.substring(1));
    await axios.put(`${reactApiUri}memo`, selectedStars);

    // prempedit
    await axios.put(`${reactApiUri}prempedit`);

    // prempedit3
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
      <PlayMenu
        imageNames={imageURLs}
        setImageURLs={setImageURLs}
        intervalRef={intervalRef}
      />
      <Container fluid>
        <Row>
          <COIASToolBar
            isSelect={isSelect}
            setIsSelect={setIsSelect}
            brightnessVal={brightnessVal}
            contrastVal={contrastVal}
            setBrightnessVal={setBrightnessVal}
            setContrastVal={setContrastVal}
            isReload={isReload}
            setIsReload={setIsReload}
            isHide={isHide}
            setIsHide={setIsHide}
          />
          <Col md={11}>
            <PanZoom
              imageURLs={imageURLs}
              isReload={isReload}
              brightnessVal={brightnessVal}
              contrastVal={contrastVal}
              onClickFinishButton={onClickFinishButton}
              originalStarPos={originalStarPos}
              starPos={starPos}
              setStarPos={setStarPos}
              isHide={isHide}
            />
          </Col>
        </Row>
      </Container>
      <LoadingButton loading={loading} />
    </div>
  );
}

export default COIAS;
