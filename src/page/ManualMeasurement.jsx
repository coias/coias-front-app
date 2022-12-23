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
import DeleteStarModal from '../component/model/ManualMeasurement/DeleteStarModal';
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
  zoomIn,
  setZoomIn,
  zoomOut,
  setZoomOut,
}) {
  const [show, setShow] = useState(false);
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
  // ズーム時に使用する状態管理配列
  const [scaleArray, setScaleArray] = useState(
    Array(39)
      .fill({ id: null, done: null })
      .map((_, index) => {
        let element = {};
        if (index === 0) {
          element = { id: 1, done: true };
        } else {
          element = { id: 1 + 0.5 * index, done: false };
        }
        return element;
      }),
  );
  const [renameNewStarModalShow, setRenameNewStarModalShow] = useState(false);
  const [oldStarName, setOldStarName] = useState('');

  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const [fileNum, setFileNum] = useState(0);
  const [timeList, setTimeList] = useState([]);

  const [deleteNameList, setDeleteNameList] = useState([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

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

  const writeManualDeleteList = async () => {
    const deleteStrLinesList = [];
    Object.keys(starPos).forEach((key) => {
      starPos[key].page.forEach((item, index) => {
        if (item) {
          if (item.isDeleted) {
            const deleteStrLine = `${item.name} ${index}`;
            deleteStrLinesList.push(deleteStrLine);
          }
        }
      });
    });
    await axios.put(`${reactApiUri}manual_delete_list`, deleteStrLinesList);
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

      const fileNumbers = dataList.length / 2;
      setFileNum(fileNumbers);

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

      await axios
        .get(`${reactApiUri}time_list`)
        .then((res) => res.data.result)
        .then((tmpTimeList) => {
          if (tmpTimeList.length === fileNumbers) {
            setTimeList(tmpTimeList);
          }
        })
        .catch(() => {});
    };

    getImages();
    setModeStatus({
      COIAS: true,
      Manual: true,
      Report: false,
      FinalCheck: false,
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
                isKnown: !(item[0].startsWith('H') && item[0].length === 7),
              };
              star = toObject[item[0]];
            }
            star.page[item[1]] = {
              name: item[0],
              x: parseFloat(item[2], 10),
              y: parseFloat(item[3], 10),
              isDeleted: false,
            };
          });
        })
        .catch((error) => {
          console.error(error);
        });

      await axios
        .get(`${reactApiUri}manual_delete_list`)
        .then((res) => res.data.result)
        .then((deleteStarList) =>
          deleteStarList.forEach((deleteStar) => {
            toObject[deleteStar[0]].page[deleteStar[1]].isDeleted = true;
          }),
        )
        .catch(() => {});

      // TODO : 動的なエラーハンドリング
      if (toObject['awk:']) {
        setAlertModalShow(true);
      } else {
        const res1 = await axios.get(`${reactApiUri}unknown_disp`);
        const unknownDisp = await res1.data.result;
        let leadNum;

        if (res1.data.result.length === 0) {
          leadNum = 0;
        } else {
          leadNum =
            Number(unknownDisp[unknownDisp.length - 1][0].replace('H', '')) + 1;
        }

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
              isKnown: !(item[0].startsWith('H') && item[0].length === 7),
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
      FinalCheck: false,
    });
  };

  useEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === 's') {
      setStart(!start);
    } else if (e.key === 'ArrowRight') {
      setNext(!next);
    } else if (e.key === 'ArrowLeft') {
      setBack(!back);
    } else if (e.key === 'ArrowUp') {
      setZoomIn(!zoomIn);
    } else if (e.key === 'ArrowDown') {
      setZoomOut(!zoomOut);
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
            setSetting={setSetting}
            scaleArray={scaleArray}
            setScaleArray={setScaleArray}
            zoomIn={zoomIn}
            setZoomIn={setZoomIn}
            zoomOut={zoomOut}
            setZoomOut={setZoomOut}
            wrapperRef={wrapperRef}
            isHide={isHide}
            setIsHide={setIsHide}
          />
          <Container fluid>
            <Row className="m-0 p-0">
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
                  setSetting={setSetting}
                  setting={setting}
                  timeList={timeList}
                  setBrightnessVal={setBrightnessVal}
                  setContrastVal={setContrastVal}
                  setDeleteNameList={setDeleteNameList}
                  setDeleteModalShow={setDeleteModalShow}
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
                      FinalCheck: false,
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
        setLoading={setLoading}
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
      <DeleteStarModal
        show={deleteModalShow}
        onExit={() => {
          setDeleteModalShow(false);
          setDeleteNameList([]);
        }}
        onExited={() => {
          if (isAutoSave) {
            writeManualDeleteList();
          }
          setDeleteNameList([]);
        }}
        deleteNameList={deleteNameList}
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
  zoomIn: PropTypes.bool.isRequired,
  setZoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.bool.isRequired,
  setZoomOut: PropTypes.func.isRequired,
};
