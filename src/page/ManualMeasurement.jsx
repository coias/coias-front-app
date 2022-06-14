import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { PageContext, StarPositionContext } from '../component/context';
import ConfirmationModal from '../component/ConfirmationModal';
import COIASToolBar from '../component/COIASToolBar';
import PlayMenu from '../component/PlayMenu';

function ManualMeasurement({
  imageURLs,
  originalStarPos,
  setImageURLs,
  intervalRef,
  positionList,
  setPositionList,
  setOriginalStarPos,
}) {
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [show, setShow] = useState(false);
  const [firstPosition, setFirstPosition] = useState({});
  const [isGrab, setIsGrab] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [isHide, setIsHide] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [defaultZoomRate, setDefaultZoomRate] = useState(40);
  const [loading, setLoading] = useState(false);
  const { setCurrentPage } = useContext(PageContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
  useEffect(() => {
    setIsGrab(true);
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
    console.log(loading);
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

  // const reactApiUri = process.env.REACT_APP_API_URI;
  // const navigate = useNavigate();
  const onClickFinishButton = async () => {
    const starNameList = Object.keys(starPos).filter((element) =>
      element.startsWith('H'),
    );
    const headStarNumber = Number(
      starNameList[starNameList.length - 1].replace('H', ''),
    );

    const getStarNumberStr = (index) =>
      `H${'00000'.slice(-(6 - headStarNumber.toString().length))}${
        headStarNumber + index + 1
      }`;

    const result = positionList.map((list, i) =>
      list.map(
        (pos) =>
          `${getStarNumberStr(i)} ${pos.page} ${pos.center.x} ${pos.center.y} ${
            pos.rectPos1.x
          } ${pos.rectPos1.y} ${pos.rectPos2.x} ${pos.rectPos2.y} ${
            pos.rectPos3.x
          } ${pos.rectPos3.y}\n`,
      ),
    );

    const text = result.map((pos) => pos.join('')).join('');

    alert(text);

    /*
    // memo2
    await axios.put(`${reactApiUri}memo2`, null, {
      params: {
        text,
      },
    });

    // astsearch_manual
    await axios.put(`${reactApiUri}astsearch_manual`);

    navigate('/COIAS');
    */
  };

  return (
    <div className="coias-view-main">
      <PlayMenu
        imageNames={imageURLs}
        setImageURLs={setImageURLs}
        intervalRef={intervalRef}
        setDefaultZoomRate={setDefaultZoomRate}
        defaultZoomRate={defaultZoomRate}
      />
      <Container fluid>
        <Row>
          <COIASToolBar
            isGrab={isGrab}
            setIsGrab={setIsGrab}
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
          <Col sm={2} md={2}>
            <ManualToolBar
              positionList={positionList}
              setPositionList={setPositionList}
              setFirstPosition={setFirstPosition}
              onClickFinishButton={onClickFinishButton}
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
          </Col>
          <Col sm={9} md={9}>
            <PanZoom
              imageURLs={imageURLs}
              originalStarPos={originalStarPos}
              starPos={starPos}
              setStarPos={setStarPos}
              isManual
              positionList={positionList}
              setPositionList={setPositionList}
              show={show}
              setShow={setShow}
              firstPosition={firstPosition}
              setFirstPosition={setFirstPosition}
              brightnessVal={brightnessVal}
              contrastVal={contrastVal}
              isReload={isReload}
              setIsHide={setIsHide}
              isHide={isHide}
              activeKey={activeKey}
              defaultZoomRate={defaultZoomRate}
            />
          </Col>
        </Row>
        <ConfirmationModal
          show={show}
          onHide={() => {
            setShow(false);
          }}
        />
      </Container>
    </div>
  );
}

export default ManualMeasurement;

ManualMeasurement.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
  positionList: PropTypes.arrayOf(PropTypes.array).isRequired,
  setPositionList: PropTypes.func.isRequired,
  setOriginalStarPos: PropTypes.func.isRequired,
};
