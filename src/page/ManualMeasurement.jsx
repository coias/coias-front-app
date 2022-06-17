import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { PageContext, StarPositionContext } from '../component/context';
import COIASToolBar from '../component/COIASToolBar';
import PlayMenu from '../component/PlayMenu';
import ManualStarModal from '../component/ManualStarModalShow';

function ManualMeasurement({
  imageURLs,
  setImageURLs,
  intervalRef,
  positionList,
  setPositionList,
  setOriginalStarPos,
  start,
  setStart,
  next,
  setNext,
  back,
  setBack,
}) {
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [show, setShow] = useState(false);
  const [isSelect, setIsSelect] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [isHide, setIsHide] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [defaultZoomRate, setDefaultZoomRate] = useState(40);
  const [loading, setLoading] = useState(false);
  const [manualStarModalShow, setManualStarModalShow] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);

  const { currentPage, setCurrentPage } = useContext(PageContext);

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
    console.log(loading);
    getImages();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(unknown_disp.txtの処理)
    // unknown_disp.txtを取得
    const getReDisp = async () => {
      setLoading(true);

      const toObject = {};
      await axios
        .put(`${reactApiUri}redisp`)
        .then((res) => {
          const reDisp = res.data.result;

          // 選択を同期させるため、オブジェクトに変更
          reDisp.forEach((item) => {
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
        })
        .catch((error) => {
          console.log(error);
        });

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
          getReDisp();
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
    document.getElementById('wrapper-coias').focus();
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

    console.log(positionList[0][0]);

    const result = positionList.map((list, i) =>
      list.map(
        (pos) =>
          `${getStarNumberStr(i)} ${pos.page} ${pos.center.x} ${pos.center.y} ${
            pos.actualA.x
          } ${pos.actualA.y} ${pos.actualB.x} ${pos.actualB.y} ${
            pos.actualC.x
          } ${pos.actualC.y}\n`,
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

  const removePositionByIndex = (targetListIndex, targetElementIndex) => {
    setPositionList(
      positionList.map((position, index) => {
        if (index === targetListIndex) {
          return position.filter(
            (elementPosition) => targetElementIndex !== elementPosition.page,
          );
        }
        return position;
      }),
    );
  };

  const keyPress = (e) => {
    if (e.keyCode === 83) setStart(!start);
    if (e.keyCode === 39) setNext(!next);
    if (e.keyCode === 37) setBack(!back);
  };

  const checkIsPositionSelected = () => {
    if (positionList[activeKey] && positionList[activeKey][currentPage]) {
      return true;
    }
    return false;
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="coias-view-main"
      id="wrapper-coias"
      onKeyDown={keyPress}
      tabIndex={-1}
    >
      <PlayMenu
        imageNames={imageURLs}
        setImageURLs={setImageURLs}
        intervalRef={intervalRef}
        setDefaultZoomRate={setDefaultZoomRate}
        defaultZoomRate={defaultZoomRate}
        start={start}
        next={next}
        setNext={setNext}
        back={back}
        setBack={setBack}
        onClickFinishButton={onClickFinishButton}
        isManual
      />
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
        <Col sm={9} md={9}>
          <PanZoom
            imageURLs={imageURLs}
            starPos={starPos}
            setStarPos={setStarPos}
            isManual
            positionList={positionList}
            show={show}
            setShow={setShow}
            brightnessVal={brightnessVal}
            contrastVal={contrastVal}
            isReload={isReload}
            isHide={isHide}
            setManualStarModalShow={setManualStarModalShow}
            isZoomIn={isZoomIn}
            setIsZoomIn={setIsZoomIn}
          />
        </Col>
        <Col sm={2} md={2}>
          <ManualToolBar
            positionList={positionList}
            setPositionList={setPositionList}
            onClickFinishButton={onClickFinishButton}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
          />
        </Col>
      </Row>

      <ManualStarModal
        manualStarModalShow={manualStarModalShow}
        onHide={() => {
          setManualStarModalShow(false);
        }}
        defaultZoomRate={defaultZoomRate}
        imageURLs={imageURLs}
        activeKey={activeKey}
        setPositionList={setPositionList}
        isPositionSlected={checkIsPositionSelected()}
        onClickRemove={() => {
          if (window.confirm('本当に削除しますか？')) {
            const targetElementIndex = positionList[activeKey].findIndex(
              (activeArray) => activeArray.page === currentPage,
            );
            removePositionByIndex(activeKey, targetElementIndex);
            setManualStarModalShow(false);
          }
        }}
        onClickNext={() => {
          setIsZoomIn(false);
          setManualStarModalShow(false);
        }}
      />
    </div>
  );
}

export default ManualMeasurement;

ManualMeasurement.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
  positionList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
    .isRequired,
  setPositionList: PropTypes.func.isRequired,
  setOriginalStarPos: PropTypes.func.isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
  next: PropTypes.bool.isRequired,
  setNext: PropTypes.func.isRequired,
  back: PropTypes.bool.isRequired,
  setBack: PropTypes.func.isRequired,
};
