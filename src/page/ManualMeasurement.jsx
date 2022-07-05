/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { PageContext, StarPositionContext } from '../component/context';
import COIASToolBar from '../component/COIASToolBar';
import PlayMenu from '../component/PlayMenu';
import ManualStarModal from '../component/ManualStarModal';
import {
  convertFits2PngCoords,
  convertPng2FitsCoords,
} from '../utils/CONSTANTS';
import ManualAlertModal from '../component/ManualAlertModal';
import StarsList from '../component/StarsList';
import ConfirmationModal from '../component/ConfirmationModal';

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
  setLeadStarNumber,
  originalStarPos,
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
  const [manualAlertModalShow, setManualAlertModalShow] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [confirmationModalShow, setConfirmationModalShow] = useState(false);
  const [checkedState, setCheckedState] = useState([false]);
  const [isRedisp, setIsRedisp] = useState(false);
  const [fitsSize, setFitsSize] = useState({});
  const [confirmMessage, setConfirmMessage] = useState('');

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/Report', { state: { isManual: true } });
  };
  const [fileNum, setFileNum] = useState(0);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { currentPage, setCurrentPage } = useContext(PageContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 画面表示時、１回だけ処理(copyの実行、各画像のURL取得)
  // 画面表示時、１回だけ処理(redisp.txtの処理)
  useEffect(() => {
    const toObjectArray = [];
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
    // nginxにある画像を全て取得
    const getImages = async () => {
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();
      setFileNum(dataList.length / 2);

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
    const getFitsSize = async () => {
      await axios
        .get(`${reactApiUri}fits_size`)
        .then((res) => res.data.result)
        .then((data) => {
          setFitsSize({ x: data[0], y: data[1] });
        })
        .catch((e) => console.error(e));
    };
    getFitsSize();
    getImages();
  }, []);

  useEffect(() => {
    // 画面表示時、１回だけ処理(redisp.txtの処理)
    // redisp.txtを取得
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
                page: Array(5).fill(null),
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
          console.error(error);
        });

      // TODO : 動的なエラーハンドリング
      if (toObject['awk:']) {
        setManualAlertModalShow(true);
      } else {
        const res1 = await axios.get(`${reactApiUri}unknown_disp`);
        const unknownDisp = await res1.data.result;

        const leadNum =
          Number(unknownDisp[unknownDisp.length - 1][0].replace('H', '')) + 1;

        setLeadStarNumber(leadNum);
        setStarPos(toObject);
        setLoading(false);
      }
    };

    const getMemoManual = async () => {
      await axios
        .get(`${reactApiUri}memo_manual`)
        .then((response) => response.data.memo_manual)
        .then((starsList) => {
          const toPositionList = [];
          starsList.forEach((star, index) => {
            const starInfo = star.split(' ');
            const prevStarName = starsList[index - 1]?.split(' ')[0];
            const center = convertFits2PngCoords(
              [Number(starInfo[2]), Number(starInfo[3])],
              fitsSize,
            );
            const A = convertFits2PngCoords(
              [Number(starInfo[4]), Number(starInfo[5])],
              fitsSize,
            );
            const B = convertFits2PngCoords(
              [Number(starInfo[6]), Number(starInfo[7])],
              fitsSize,
            );
            const C = convertFits2PngCoords(
              [Number(starInfo[8]), Number(starInfo[9])],
              fitsSize,
            );

            const value = {
              page: Number(starInfo[1]),
              x: center.x,
              y: center.y,
              center,
              actualA: A,
              actualB: B,
              actualC: C,
            };
            if (starInfo[0] !== prevStarName) {
              toPositionList.push([]);
            }
            toPositionList[toPositionList.length - 1].splice(
              Number(value.page),
              1,
              value,
            );
          });
          setPositionList(toPositionList);
          setCheckedState(Array(toPositionList.length).fill(false));
        })
        .catch((e) => console.error(e));
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
          getMemoManual();
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

  const onClickFinishButton = async (filteredList = []) => {
    const targetList = filteredList.length === 0 ? positionList : filteredList;

    const result = targetList.flatMap((list, i) =>
      list.flatMap((pos) => {
        const convertedCenter = convertPng2FitsCoords(pos.center, fitsSize);
        const convertedA = convertPng2FitsCoords(pos.actualA, fitsSize);
        const convertedB = convertPng2FitsCoords(pos.actualB, fitsSize);
        const convertedC = convertPng2FitsCoords(pos.actualC, fitsSize);

        return `${'000000'.slice((leadStarNumber + i).toString().length - 6)}${
          leadStarNumber + i
        } ${pos.page} ${convertedCenter.x} ${convertedCenter.y} ${
          convertedA.x
        } ${convertedA.y} ${convertedB.x} ${convertedB.y} ${convertedC.x} ${
          convertedC.y
        }`;
      }),
    );

    await axios.put(`${reactApiUri}memo_manual`, result);
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

  const handleClick = async () => {
    setLoading(true);

    const toObject = {};

    await axios
      .put(`${reactApiUri}AstsearchR_after_manual`)
      .then((res) => {
        const rereDisp = res.data.reredisp.split('\n');

        // 選択を同期させるため、オブジェクトに変更
        rereDisp.forEach((items) => {
          const item = items.split(' ');
          let star = toObject[item[0]];
          if (!star) {
            toObject[item[0]] = {
              name: item[0],
              page: Array(5).fill(null),
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
        console.error(error);
      });

    setOriginalStarPos(starPos);
    setStarPos(toObject);
    setLoading(false);
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
        setIsAutoSave={setIsAutoSave}
        isAutoSave={isAutoSave}
        fileNum={fileNum}
        disable={isRedisp}
        setDisable={setIsRedisp}
        handleClick={handleClick}
        originalStarPos={originalStarPos}
        loading={loading}
        handleNavigate={handleNavigate}
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
              confirmationModalShow={confirmationModalShow}
              setConfirmationModalShow={setConfirmationModalShow}
              setOriginalStarPos={setOriginalStarPos}
              fitsSize={fitsSize}
              disable={isRedisp}
              setConfirmMessage={setConfirmMessage}
            />
          </Col>
          <Col sm={2} md={2}>
            {isRedisp ? (
              <StarsList disable={isRedisp} isManual />
            ) : (
              <ManualToolBar
                positionList={positionList}
                setPositionList={setPositionList}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
                leadStarNumber={leadStarNumber}
                checkedState={checkedState}
                setCheckedState={setCheckedState}
                onClickFinishButton={onClickFinishButton}
              />
            )}
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
        }}
        onExited={() => {
          if (isAutoSave) {
            onClickFinishButton();
          }
        }}
        leadStarNumber={leadStarNumber}
      />

      <ConfirmationModal
        show={confirmationModalShow}
        onHide={() => {
          setConfirmationModalShow(false);
        }}
        onExit={() => setIsZoomIn(false)}
        onEntered={() => setIsZoomIn(true)}
        removePositionByIndex={removePositionByIndex}
        setManualStarModalShow={setManualStarModalShow}
        positionList={positionList}
        activeKey={activeKey}
        leadStarNumber={leadStarNumber}
        onClickYes={() => {
          setConfirmationModalShow(false);
          if (confirmMessage.includes('削除')) {
            removePositionByIndex(activeKey, currentPage);
          } else if (confirmMessage.includes('更新')) {
            setManualStarModalShow(true);
          }
        }}
        confirmMessage={confirmMessage}
      />

      <ManualAlertModal
        manualAlertModalShow={manualAlertModalShow}
        onClickOk={() => {
          navigate('/COIAS');
          setManualAlertModalShow(false);
        }}
        alertMessage="再描画を行ってください"
        alertButtonMessage="探索/再描画に戻る"
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
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
  next: PropTypes.bool.isRequired,
  setNext: PropTypes.func.isRequired,
  back: PropTypes.bool.isRequired,
  setBack: PropTypes.func.isRequired,
  leadStarNumber: PropTypes.number.isRequired,
  setLeadStarNumber: PropTypes.func.isRequired,
};
