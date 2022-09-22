/*
 * 探索準備モード
 *
 */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useRef, useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { GoSettings } from 'react-icons/go';
import { ModeStatusContext } from '../component/functional/context';
import AlertModal from '../component/general/AlertModal';
import ErrorModal from '../component/general/ErrorModal';
import LoadingButton from '../component/general/LoadingButton';
import FileUploadModal from '../component/model/ExplorePrepare/FileUploadModal';
import CONSTANT from '../utils/CONSTANTS';
import ParamsSettingModal from '../component/model/ExplorePrepare/ParamsSettingModal';

// eslint-disable-next-line no-use-before-define
ExplorePrepare.propTypes = {
  fileNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFileNames: PropTypes.func.isRequired,
  menunames: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMenunames: PropTypes.func.isRequired,
  isAuto: PropTypes.bool.isRequired,
  setIsAuto: PropTypes.func.isRequired,
};

function ExplorePrepare({
  fileNames,
  setFileNames,
  menunames,
  setMenunames,
  isAuto,
  setIsAuto,
}) {
  const uri = process.env.REACT_APP_API_URI;
  const [loading, setLoading] = useState(false);

  const fileInput = useRef();
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [processName, setProcessName] = useState('');
  const [showProcessError, setShowProcessError] = useState(false);
  const [errorPlace, setErrorPlace] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [errorFiles, setErrorFile] = useState([]);
  const [fileAlertModalshow, setFileAlertModalshow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtonMessage, setAlertButtonMessage] = useState('');
  const [parameters, setParameters] = useState({
    nd: '4',
    ar: '6',
    sn: '500',
  });
  const [paramsSettingModalShow, setParamsSettingModalShow] = useState(false);

  const { setModeStatus } = useContext(ModeStatusContext);

  const checkIsAllProcessDone = (updatedMenunames) =>
    !updatedMenunames
      .filter((content) => content.id !== 1 && content.id !== 7)
      .find((menu) => !menu.done);

  const handleSelect = (e) => setIsAuto(e.target.value === 'auto');

  const handleClose = () => {
    setMenunames(menunames);
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleChange = (e) => {
    // ファイル変更時
    if (e.target.value !== '') {
      setValid(false);
      setDisabled(false);
    } else {
      setValid(true);
      setDisabled(true);
    }
  };

  const fileContentCheck = async () => {
    const reactApiUri = process.env.REACT_APP_API_URI;
    const response = await axios.put(`${reactApiUri}copy`);
    const dataList = response.data.result.sort();
    if (fileNames.length !== dataList.length / 2) {
      setAlertMessage('ファイルの中身が異なる可能性があります。');
      setAlertButtonMessage('アップロードに戻る');
      setFileAlertModalshow(true);
    }
  };

  const updateMenunames = () => {
    setMenunames((prevMenunames) =>
      prevMenunames.map((items) =>
        items.done === true
          ? {
              id: items.id,
              name: items.name,
              query: items.query,
              done: false,
            }
          : items,
      ),
    );
    setMenunames((prevMenunames) =>
      prevMenunames.map((items) =>
        items.id === 1
          ? { id: items.id, name: items.name, query: items.query, done: true }
          : items,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMenunames((prevMenunames) =>
      prevMenunames.map((items) =>
        items.id === 6
          ? {
              id: items.id,
              name: items.name,
              query: items.query,
              done: false,
            }
          : items,
      ),
    );
    const { files } = fileInput.current;
    const data = new FormData();
    const filesForProps = [];
    setErrorFile([]);

    const pattern =
      /warp-HSC-.*-([0-9]{1,4})-([0-9]),([0-9])-([0-9]{1,6}).fits/;
    const firstFileAreaName = files[0].name
      .split('-')
      .filter((_, index) => index === 3 || index === 4)
      .join('');

    const errorFileNames = [];

    if (files.length < 3) {
      errorFileNames.push('ファイルが足りません。3つ以上選択してください。');
    }

    Object.values(files).forEach((file, i) => {
      const isMatch = pattern.test(file.name);
      if (i > 0 && isMatch) {
        const isSameArea =
          file.name
            .split('-')
            .filter((_, index) => index === 3 || index === 4)
            .join('')
            .indexOf(firstFileAreaName) > -1;
        if (!isSameArea) {
          errorFileNames.push(`${file.name}は観測領域が異なります。`);
        }
      }

      if (!isMatch) {
        errorFileNames.push(`${file.name}のファイル名の形式が違います。`);
      }

      data.append('files', file, file.name);
      filesForProps.push(file.name);
    });

    setErrorFile(errorFileNames);

    const postFiles = async () => {
      handleClose();
      setProcessName('アップロード中...');

      setLoading(true);
      await axios
        .delete(`${uri}deletefiles`)
        .then(() => {})
        .catch(() => {
          setShowProcessError(true);
          setErrorPlace('ファイルアップロード');
          setErrorReason('ファイルアップロードに失敗しました。');
          setLoading(false);
        });
      await axios
        .post(`${uri}uploadfiles/`, data)
        .then(() => {
          updateMenunames();
          setLoading(false);
        })
        .catch(() => {
          setShowProcessError(true);
          setErrorPlace('ファイルアップロード');
          setErrorReason('ファイルアップロードに失敗しました');
          setLoading(false);
        });
    };

    if (errorFileNames.length === 0) {
      setFileNames(filesForProps);
      postFiles();
    }
    return null;
  };

  const onProcess = (query) => {
    setProcessName('処理中...');
    const put = async () => {
      setLoading(true);
      await axios
        .put(uri + query)
        .then(() => {
          const updatedMenunames = menunames.map((item) => {
            if (
              item.query === query ||
              (query.startsWith('startsearch2R?binning=') &&
                item.query.startsWith('startsearch2R?binning=')) ||
              (query.startsWith('astsearch_new') &&
                item.query.startsWith('astsearch_new'))
            ) {
              // eslint-disable-next-line no-param-reassign
              item.done = true;
            }
            if (query.startsWith('startsearch2R?binning=')) {
              fileContentCheck();
            }
            return item;
          });
          setModeStatus((prevModeStatus) => {
            const modeStatusCopy = { ...prevModeStatus };
            modeStatusCopy.COIAS = checkIsAllProcessDone(updatedMenunames);
            return modeStatusCopy;
          });
          setMenunames(updatedMenunames);
          setLoading(false);
        })
        .catch((e) => {
          const errorResponse = e.response?.data?.detail;
          if (errorResponse.place) {
            setErrorPlace(errorResponse.place);
            setErrorReason(errorResponse.reason);
            setShowProcessError(true);
          }
          setLoading(false);
        });
    };
    if (query.length > 0) put();
  };

  /**
   * 処理の処理をまとめたモノ？
   *
   * @param {通信先} url
   * @param {処理名} query
   * @returns
   */
  const onProcessExecute = async (url, query) => {
    let result = true;
    const uriQuery = url.split('/')[3];
    setProcessName(`${query}...`);
    await axios
      .put(url)
      .then(() => {
        const updatedMenunames = menunames.map((item) => {
          if (
            item.query === uriQuery ||
            (uriQuery.startsWith('startsearch2R?binning=') &&
              item.query.startsWith('startsearch2R?binning=')) ||
            (uriQuery.startsWith('astsearch_new') &&
              item.query.startsWith('astsearch_new'))
          ) {
            // eslint-disable-next-line no-param-reassign
            item.done = true;
          }
          return item;
        });
        setMenunames(updatedMenunames);
        if (uriQuery.startsWith('startsearch2R?binning=')) {
          fileContentCheck();
        }
        setModeStatus((prevModeStatus) => {
          const modeStatusCopy = { ...prevModeStatus };
          modeStatusCopy.COIAS = checkIsAllProcessDone(updatedMenunames);
          return modeStatusCopy;
        });
      })
      .catch((e) => {
        const errorResponse = e.response?.data?.detail;
        if (errorResponse?.place) {
          setErrorPlace(errorResponse.place);
          setErrorReason(errorResponse.reason);
          setShowProcessError(true);
        }
        result = false;
        setLoading(false);
      });
    return result;
  };

  /**
   * 全自動処理。
   *
   * @param {ビニングマスクのサイズ} 2×2で固定
   * @returns
   */
  const onProcessAuto = async () => {
    // 事前処理
    setLoading(true);

    let result = true;
    result = await onProcessExecute(`${uri}preprocess`, '事前処理');
    if (!result) {
      return;
    }
    // ビニングマスク（size: 2)
    result = await onProcessExecute(
      `${uri}startsearch2R?binning=2&sn=${parameters.sn}`,
      `ビニングマスク（'2x2'）`,
    );
    if (!result) {
      return;
    }
    // 軌道取得（確定番号）
    result = await onProcessExecute(
      `${uri}prempsearchC-before`,
      '軌道取得（確定番号）',
    );
    if (!result) {
      return;
    }
    // 軌道取得（仮符号）
    result = await onProcessExecute(
      `${uri}prempsearchC-after`,
      '軌道取得（仮符号）',
    );
    if (!result) {
      return;
    }

    // 自動検出
    await onProcessExecute(
      `${uri}astsearch_new?nd=${parameters.nd}&ar=${parameters.ar}`,
      '自動検出',
    );

    const items = [...menunames];
    const item = { ...items[6] };
    item.done = true;
    items[6] = item;
    setMenunames(items);
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: '40px',
        height: '100%',
      }}
    >
      <Row>
        <Col md={2}>
          <Row style={{ marginBottom: '40px' }}>
            <h4>探索準備</h4>
          </Row>
          <Row style={{ marginBottom: '40px' }}>
            <h4>選択ファイル</h4>
          </Row>
        </Col>
        <Col md={10}>
          <Row xs="auto" style={{ marginBottom: '40px' }}>
            <Col style={{ margin: 'auto 0' }}>
              <Button
                variant={menunames[0].done ? 'success' : 'secondary'}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  handleShow();
                }}
              >
                ファイル
              </Button>
            </Col>
            {isAuto ? (
              <Col style={{ margin: 'auto 0' }}>
                <Button
                  style={{ whiteSpace: 'nowrap' }}
                  key="Success"
                  id="dropdown-variants-Success"
                  variant={menunames[6].done ? 'success' : 'secondary'}
                  title={menunames[6].name}
                  onClick={() => onProcessAuto()}
                >
                  {menunames[6].name}
                </Button>
              </Col>
            ) : (
              <>
                <Col style={{ paddingRight: 0 }}>
                  <Button
                    id={menunames[1].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[1].query);
                    }}
                    variant={menunames[1].done ? 'success' : 'secondary'}
                  >
                    {menunames[1].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <DropdownButton
                    as={ButtonGroup}
                    variant={menunames[2].done ? 'success' : 'secondary'}
                    title={menunames[2].name}
                  >
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() =>
                        onProcess(`${menunames[2].query}2&sn=${parameters.sn}`)
                      }
                    >
                      2×2
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="2"
                      onClick={() =>
                        onProcess(`${menunames[2].query}4&sn=${parameters.sn}`)
                      }
                    >
                      4×4
                    </Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[3].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[3].query);
                    }}
                    variant={menunames[3].done ? 'success' : 'secondary'}
                  >
                    {menunames[3].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[4].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(menunames[4].query);
                    }}
                    variant={menunames[4].done ? 'success' : 'secondary'}
                  >
                    {menunames[4].name}
                  </Button>
                </Col>
                <Col style={{ margin: 'auto 0', padding: 0 }}>
                  <HiOutlineArrowSmRight size={28} />
                </Col>
                <Col style={{ padding: 0 }}>
                  <Button
                    id={menunames[5].query}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      onProcess(
                        `${menunames[5].query}?nd=${parameters.nd}&ar=${parameters.ar}`,
                      );
                    }}
                    variant={menunames[5].done ? 'success' : 'secondary'}
                  >
                    {menunames[5].name}
                  </Button>
                </Col>
              </>
            )}
            <Button
              className={isAuto ? '' : 'params-btn'}
              onClick={() => setParamsSettingModalShow(true)}
            >
              <GoSettings size={CONSTANT.iconSize} />
            </Button>
          </Row>
          <Row>
            <Col style={{ margin: 'auto 0' }}>
              <div
                style={{
                  backgroundColor: 'black',
                  width: '70vw',
                  height: '500px',
                  border: '3px solid #282A7F',
                  borderRadius: '4px',
                }}
              >
                <ul style={{ listStyleType: 'none', color: 'white' }}>
                  {fileNames.map((arr) => (
                    <li key={arr}>{arr}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <LoadingButton loading={loading} processName={processName} />

      <FileUploadModal
        show={show}
        isAutoProcess={isAuto}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        fileInput={fileInput}
        handleChange={handleChange}
        valid={valid}
        errorFiles={errorFiles}
        handleSelect={handleSelect}
        disabled={disabled}
        onClickStarUpdateButton={async () => {
          handleClose();
          setLoading(true);
          await axios
            .put(`${uri}getMPCORB_and_mpc2edb`)
            .then(() => {
              setProcessName('小惑星データ更新中...');
              setLoading(false);
            })
            .catch((e) => {
              const errorResponse = e.response?.data?.detail;
              if (errorResponse.place) {
                setErrorPlace(errorResponse.place);
                setErrorReason(errorResponse.reason);
                setShowProcessError(true);
              }
            });
          setLoading(false);
        }}
        setParameters={setParameters}
        parameters={parameters}
        alertMessage={alertMessage}
      />
      <ParamsSettingModal
        show={paramsSettingModalShow}
        handleClose={() => setParamsSettingModalShow(false)}
        setParameters={setParameters}
        parameters={parameters}
        setMenunames={setMenunames}
        inputFileLength={fileNames.length}
      />
      <AlertModal
        alertModalShow={fileAlertModalshow}
        onClickOk={() => {
          /* TODO : Window以外で実装が理想 */
          window.location.reload();
          setFileAlertModalshow(false);
        }}
        alertMessage={alertMessage}
        alertButtonMessage={alertButtonMessage}
      />
      <ErrorModal
        show={showProcessError}
        setShow={setShowProcessError}
        errorPlace={errorPlace}
        errorReason={errorReason}
        setLoading={setLoading}
      />
    </div>
  );
}

export default ExplorePrepare;
