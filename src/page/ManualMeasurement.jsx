import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
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

  const reactApiUri = process.env.REACT_APP_API_URI;

  const navigate = useNavigate();
  const onClickFinishButton = async () => {
    if (positionList.length === 0) return;
    const result = positionList.map((list, i) =>
      list.map(
        (pos, page) =>
          `('${pos.currentMousePos.x}' , '${pos.currentMousePos.y}', warp${
            page + 1
          }_bin.fits, '${i}')\n`,
      ),
    );

    const text = result[0].join('');
    await axios.put(`${reactApiUri}memo2`, null, {
      params: {
        text,
      },
    });
    navigate('/COIAS');
  };

  return (
    <div className="coias-view-main">
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
            <Button onClick={() => onClickFinishButton()}>手動測定終了</Button>
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
    </div>
  );
}

export default ManualMeasurement;

ManualMeasurement.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.object).isRequired,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
};
