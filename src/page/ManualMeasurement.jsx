import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import ManualToolBar from '../component/ManualToolBar';
import PanZoom from '../component/PanZoom';
import { StarPositionContext } from '../component/context';
import ConfirmationModal from '../component/ConfirmationModal';

function ManualMeasurement({ imageURLs, originalStarPos }) {
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [positionList, setPositionList] = useState([]);
  const [show, setShow] = useState(false);

  return (
    <Container fluid>
      <Row>
        <Col sm={3}>
          <ManualToolBar
            positionList={positionList}
            setPositionList={setPositionList}
          />
        </Col>
        <Col>
          <PanZoom
            imageURLs={imageURLs}
            originalStarPos={originalStarPos}
            starPos={starPos}
            setStarPos={setStarPos}
            isManual
            isReload={false}
            positionList={positionList}
            setPositionList={setPositionList}
            show={show}
            setShow={setShow}
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
