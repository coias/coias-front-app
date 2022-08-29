/* eslint-disable no-param-reassign */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ModeStatusContext,
  PageContext,
  StarPositionContext,
} from '../component/functional/context';
import AlertModal from '../component/general/AlertModal';
import ErrorModal from '../component/general/ErrorModal';
import ManualStarModal from '../component/model/ManualMeasurement/ManualStarModal';
import ManualToolBar from '../component/model/ManualMeasurement/ManualToolBar';
import RenameNewStarModal from '../component/model/ManualMeasurement/RenameNewStarModal';
import COIASToolBar from '../component/model/MeasurementCommon/COIASToolBar';
import PanZoom from '../component/model/MeasurementCommon/PanZoom';
import PlayMenu from '../component/model/MeasurementCommon/PlayMenu';
import StarsList from '../component/model/MeasurementCommon/StarsList';
import ConfirmationModal from '../component/ui/ConfirmationModal';
import useEventListener from '../hooks/useEventListener';

function ManualMeasurement({
  imageURLs,
  setImageURLs,
  intervalRef,
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
  setting,
  setSetting,
}) {
  const [show, setShow] = useState(false);
  const [isSelect, setIsSelect] = useState(true);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [isHide, setIsHide] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [defaultZoomRate, setDefaultZoomRate] = useState(40);
  const [loading, setLoading] = useState(false);
  const [manualStarModalShow, setManualStarModalShow] = useState(false);
  const [alertModalShow, setAlertModalShow] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [confirmationModalShow, setConfirmationModalShow] = useState(false);
  const [checkedState, setCheckedState] = useState([false]);
  const [isRedisp, setIsRedisp] = useState(false);
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [positionList, setPositionList] = useState([[]]);
  const [scaleArray, setScaleArray] = useState([
    { id: 1, done: true },
    { id: 1.5, done: false },
    { id: 2, done: false },
    { id: 2.5, done: false },
    { id: 3, done: false },
    { id: 3.5, done: false },
    { id: 4, done: false },
    { id: 4.5, done: false },
    { id: 5, done: false },
    { id: 5.5, done: false },
    { id: 6, done: false },
    { id: 6.5, done: false },
    { id: 7, done: false },
    { id: 7.5, done: false },
    { id: 8, done: false },
    { id: 8.5, done: false },
    { id: 9, done: false },
    { id: 9.5, done: false },
    { id: 10, done: false },
    { id: 10.5, done: false },
    { id: 11, done: false },
    { id: 11.5, done: false },
    { id: 12, done: false },
    { id: 12.5, done: false },
    { id: 13, done: false },
    { id: 13.5, done: false },
    { id: 14, done: false },
    { id: 14.5, done: false },
    { id: 15, done: false },
    { id: 15.5, done: false },
    { id: 16, done: false },
    { id: 16.5, done: false },
    { id: 17, done: false },
    { id: 17.5, done: false },
    { id: 18, done: false },
    { id: 18.5, done: false },
    { id: 19, done: false },
    { id: 19.5, done: false },
    { id: 20, done: false },
  ]);
  const [renameNewStarModalShow, setRenameNewStarModalShow] = useState(false);
  const [oldStarName, setOldStarName] = useState('');

  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const [fileNum, setFileNum] = useState(0);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { currentPage } = useContext(PageContext);
  const { setModeStatus } = useContext(ModeStatusContext);

  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  const isEditMode = useCallback(
    () => checkedState.find((element) => element === true),
    [checkedState],
  );

  const onClickFinishButton = async (filteredList = []) => {
    const targetList = filteredList.length === 0 ? positionList : filteredList;
    await axios.put(`${reactApiUri}memo_manual`, targetList);
  };

  const removePositionListByCheckState = () => {
    const isAllRemove = !checkedState.some((element) => element === false);

    if (isAllRemove) {
      setPositionList([[]]);
      onClickFinishButton([[]]);
      setActiveKey(0);
      setCheckedState([false]);
    } else {
      const filteredList = positionList.filter(
        (elementPosition, index) => !checkedState[index],
      );
      setPositionList(filteredList);
      onClickFinishButton(filteredList);
      setActiveKey(filteredList.length - 1);
      setCheckedState(checkedState.filter((element) => !element));
    }
  };

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

    getImages();

    setModeStatus({
      COIAS: true,
      Manual: true,
      Report: false,
    });
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
                newName: item[0],
                page: Array(imageURLs.length).fill(null),
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
        setAlertModalShow(true);
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
            const value = {
              name: starInfo[0],
              page: Number(starInfo[1]),
              x: Number(starInfo[2]),
              y: Number(starInfo[3]),
              center: { x: Number(starInfo[2]), y: Number(starInfo[3]) },
              actualA: { x: starInfo[4], y: starInfo[5] },
              actualB: { x: starInfo[6], y: starInfo[7] },
              actualC: { x: starInfo[8], y: starInfo[9] },
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

    // setCurrentPage(0);
    document.getElementById('wrapper-coias').focus();
  }, [imageURLs]);

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
              newName: item[0],
              page: Array(imageURLs.length).fill(null),
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
      .catch((e) => {
        const errorResponse = e.response?.data?.detail;
        if (errorResponse.place) {
          setErrorPlace(errorResponse.place);
          setErrorReason(errorResponse.reason);
          setShowProcessError(true);
        }
      });

    setOriginalStarPos(starPos);
    setStarPos(toObject);
    setLoading(false);
    setModeStatus({
      COIAS: true,
      Manual: true,
      Report: true,
    });
  };

  useEventListener('keydown', (e) => {
    e.preventDefault();
    const scrollYRate =
      wrapperRef.current.scrollTop /
      (wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight);

    const scrollXRate =
      wrapperRef.current.scrollLeft /
      (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth);

    if (e.key === 's') {
      setStart(!start);
    } else if (e.key === 'ArrowRight') {
      setNext(!next);
    } else if (e.key === 'ArrowLeft') {
      setBack(!back);
    } else if (e.key === 'ArrowUp') {
      const currentIndex = scaleArray.findIndex((item) => item.done);
      const arrayCopy = scaleArray.concat();
      if (currentIndex < arrayCopy.length - 1) {
        arrayCopy[currentIndex].done = false;
        arrayCopy[currentIndex + 1].done = true;
        wrapperRef.current.scrollBy(400 * scrollXRate, 400 * scrollYRate);
      }
      setScaleArray(arrayCopy);
    } else if (e.key === 'ArrowDown') {
      const currentIndex = scaleArray.findIndex((item) => item.done);
      const arrayCopy = scaleArray.concat();
      if (currentIndex > 0) {
        arrayCopy[currentIndex].done = false;
        arrayCopy[currentIndex - 1].done = true;
        wrapperRef.current.scrollBy(-400 * scrollXRate, -400 * scrollYRate);
      }
      setScaleArray(arrayCopy);
    }
  });

  return (
    <div className="coias-view-main" id="wrapper-coias">
      <Row>
        <Col>
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
            setIsAutoSave={setIsAutoSave}
            isAutoSave={isAutoSave}
            fileNum={fileNum}
            setDisable={setIsRedisp}
            handleClick={handleClick}
            originalStarPos={originalStarPos}
            loading={loading}
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
                isHide={isHide}
                setIsHide={setIsHide}
              />
              <Col className="manual-mode-control-view">
                <PanZoom
                  imageURLs={imageURLs}
                  isManual
                  positionList={positionList}
                  show={show}
                  setShow={setShow}
                  brightnessVal={brightnessVal}
                  contrastVal={contrastVal}
                  isHide={isHide}
                  setManualStarModalShow={setManualStarModalShow}
                  isZoomIn={isZoomIn}
                  setIsZoomIn={setIsZoomIn}
                  leadStarNumber={leadStarNumber}
                  activeKey={activeKey}
                  confirmationModalShow={confirmationModalShow}
                  setConfirmationModalShow={setConfirmationModalShow}
                  setOriginalStarPos={setOriginalStarPos}
                  disable={isRedisp}
                  setConfirmMessage={setConfirmMessage}
                  scaleArray={scaleArray}
                  wrapperRef={wrapperRef}
                  setRenameNewStarModalShow={setRenameNewStarModalShow}
                  setOldStarName={setOldStarName}
                />
              </Col>
            </Row>
          </Container>
        </Col>

        <div
          className={
            isRedisp ? 'coias-star-list-wrraper' : 'manual-star-list-wrraper'
          }
          style={{ width: isRedisp ? '10vw' : '20vw' }}
        >
          {isRedisp ? (
            <StarsList
              disable={isRedisp}
              isManual
              setSelectedListState={() => {}}
            />
          ) : (
            <ManualToolBar
              positionList={positionList}
              setPositionList={setPositionList}
              activeKey={activeKey}
              confirmationModalShow={confirmationModalShow}
              setConfirmationModalShow={setConfirmationModalShow}
              disable={isRedisp}
              setConfirmMessage={setConfirmMessage}
              scaleArray={scaleArray}
              wrapperRef={wrapperRef}
              setRenameNewStarModalShow={setRenameNewStarModalShow}
              setOldStarName={setOldStarName}
              setting={setting}
              setSetting={setSetting}
              setActiveKey={setActiveKey}
              leadStarNumber={leadStarNumber}
              checkedState={checkedState}
              setCheckedState={setCheckedState}
            />
          )}
          <div
            className={
              isEditMode() ? 'manual-btn-fixed-delete' : 'manual-btn-fixed'
            }
          >
            {isEditMode() && (
              <Button
                variant="danger"
                onClick={() => {
                  removePositionListByCheckState();
                }}
                style={{ marginRight: '90px' }}
                size="lg"
              >
                削除
              </Button>
            )}
            {loading ? (
              <Spinner size="md" animation="border" />
            ) : (
              <Button
                variant="success"
                onClick={() => {
                  if (isRedisp) {
                    setStarPos(originalStarPos);
                    setModeStatus({
                      COIAS: true,
                      Manual: true,
                      Report: false,
                    });
                  } else {
                    handleClick();
                  }
                  setIsRedisp(!isRedisp);
                }}
                size="lg"
              >
                {isRedisp ? 'やり直す' : '再描画'}
              </Button>
            )}
          </div>
        </div>
      </Row>

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
        onExit={() => {
          setIsZoomIn(false);
        }}
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

      <AlertModal
        alertModalShow={alertModalShow}
        onClickOk={() => {
          navigate('/COIAS');
          setAlertModalShow(false);
        }}
        alertMessage="再描画を行ってください"
        alertButtonMessage="探索/再描画に戻る"
      />
      <ErrorModal
        show={showProcessError}
        setShow={setShowProcessError}
        errorPlace={errorPlace}
        errorReason={errorReason}
        onExit={() => {
          setIsRedisp(!isRedisp);
          setStarPos(originalStarPos);
        }}
      />
      <RenameNewStarModal
        show={renameNewStarModalShow}
        onExit={() => {
          setRenameNewStarModalShow(false);
        }}
        onClickRenameButton={async (newStarName) => {
          setRenameNewStarModalShow(false);
          const objectCopy = { ...starPos };
          objectCopy[oldStarName].newName = newStarName;
          const strArray = [];
          Object.values(objectCopy).forEach((value) =>
            strArray.push([value.name, value.newName]),
          );
          await axios.put(`${reactApiUri}manual_name_modify_list`, strArray);
          setStarPos(objectCopy);
        }}
        oldStarName={oldStarName}
        isAlreadyChanged={
          starPos[oldStarName]?.name !== starPos[oldStarName]?.newName
        }
      />
    </div>
  );
}

export default ManualMeasurement;

ManualMeasurement.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.func).isRequired,
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
  setting: PropTypes.bool.isRequired,
  setSetting: PropTypes.func.isRequired,
};
