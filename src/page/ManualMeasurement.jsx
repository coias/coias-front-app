/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { PageContext, StarPositionContext } from '../component/context';
import COIASToolBar from '../component/COIASToolBar';
import PlayMenu from '../component/PlayMenu';
import ManualStarModal from '../component/ManualStarModalShow';
import { convertPng2FitsCoords } from '../utils/CONSTANTS';

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
  leadStarNumber,
}) {
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
  const [fitsSize, setFitsSize] = useState([]);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);

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

  const onClickFinishButton = async () => {
    setIsSaveLoading(true);
    let FITSSIZE = [];
    if (fitsSize.length === 0) {
      await axios
        .get(`${reactApiUri}fits_size`)
        .then((res) => res.data.result)
        .then((data) => {
          FITSSIZE = data;
          setFitsSize(data);
        })
        .catch((e) => console.error(e));
    } else {
      FITSSIZE = fitsSize;
    }

    const result = positionList.flatMap((list, i) =>
      list.flatMap((pos) => {
        const convertedCenter = convertPng2FitsCoords(pos.center, FITSSIZE);
        const convertedA = convertPng2FitsCoords(pos.actualA, FITSSIZE);
        const convertedB = convertPng2FitsCoords(pos.actualB, FITSSIZE);
        const convertedC = convertPng2FitsCoords(pos.actualC, FITSSIZE);

        return `${'000000'.slice((leadStarNumber + i).toString().length - 6)}${
          leadStarNumber + i
        } ${pos.page} ${convertedCenter.x} ${convertedCenter.y} ${
          convertedA.x
        } ${convertedA.y} ${convertedB.x} ${convertedB.y} ${convertedC.x} ${
          convertedC.y
        }`;
      }),
    );

    const text = result.flatMap((pos) => pos);

    // memo
    await axios.put(`${reactApiUri}memo`, text);
    // memo_manual
    await axios.put(`${reactApiUri}memo_manual`, text);

    setIsSaveLoading(false);
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
        isSaveLoading={isSaveLoading}
        setIsAutoSave={setIsAutoSave}
        isAutoSave={isAutoSave}
      />
      <Container fluid>
        <Row className="m-0 p-0">
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
              leadStarNumber={leadStarNumber}
              activeKey={activeKey}
              removePositionByIndex={removePositionByIndex}
            />
          </Col>
          <Col sm={2} md={2}>
            <ManualToolBar
              positionList={positionList}
              setPositionList={setPositionList}
              onClickFinishButton={onClickFinishButton}
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              leadStarNumber={leadStarNumber}
            />
          </Col>
        </Row>
      </Container>

      <ManualStarModal
        manualStarModalShow={manualStarModalShow}
        onHide={() => {
          setManualStarModalShow(false);
          setIsZoomIn(false);
        }}
        defaultZoomRate={defaultZoomRate}
        imageURLs={imageURLs}
        activeKey={activeKey}
        setPositionList={setPositionList}
        onClickNext={() => {
          setIsZoomIn(false);
          setManualStarModalShow(false);
          if (isAutoSave) {
            onClickFinishButton();
          }
        }}
        leadStarNumber={leadStarNumber}
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
  leadStarNumber: PropTypes.number.isRequired,
};
