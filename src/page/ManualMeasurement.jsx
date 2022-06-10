import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';

import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { StarPositionContext } from '../component/context';
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
        (pos, page) =>
          `${getStarNumberStr(i)} ${page} ${pos.center.x} ${pos.center.y} ${
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
};
