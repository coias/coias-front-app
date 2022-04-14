import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { StarPositionContext } from '../component/context';
import ConfirmationModal from '../component/ConfirmationModal';
import COIASToolBar from '../component/COIASToolBar';

function ManualMeasurement({ imageURLs, originalStarPos }) {
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [positionList, setPositionList] = useState([]);
  const [show, setShow] = useState(false);
  const [firstPosition, setFirstPosition] = useState({});
  const [isGrab, setIsGrab] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);

  return (
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
        />
        <Col sm={2} md={2}>
          <ManualToolBar
            positionList={positionList}
            setPositionList={setPositionList}
            setFirstPosition={setFirstPosition}
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
  );
}

export default ManualMeasurement;

ManualMeasurement.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
};
