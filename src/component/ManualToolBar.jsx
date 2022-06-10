import { React, useContext } from 'react';
import { Button, Row, Col, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext } from './context';

function ManualToolBar({
  positionList,
  setPositionList,
  setFirstPosition,
  onClickFinishButton,
  activeKey,
  setActiveKey,
}) {
  const { setCurrentPage } = useContext(PageContext);

  const onClickAccordion = (index) => {
    setActiveKey(index);
  };

  const onClickAddButton = () => {
    setPositionList([...positionList, []]);
    setActiveKey(positionList.length);
    setCurrentPage(0);
    setFirstPosition({});
  };

  return (
    <div>
      <Row>
        <Button onClick={() => onClickFinishButton()}>手動測定終了</Button>
      </Row>
      <Row className="m-4">
        <Col
          className="d-flex justify-content-between"
          style={{ background: 'white', width: '100%', padding: '0' }}
        >
          <p style={{ margin: 'auto 0' }}>天体一覧</p>
          <Button
            variant="success"
            style={{ padding: '10px 20px' }}
            onClick={() => {
              onClickAddButton();
            }}
          >
            +
          </Button>
        </Col>
      </Row>
      <div className="manual-list">
        <Row>
          <Accordion activeKey={`${activeKey}`}>
            {positionList.map((d, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                onClick={() => onClickAccordion(index)}
              >
                <Accordion.Header>#{index}</Accordion.Header>
                <Accordion.Body>
                  {d.map((e) => (
                    <li id="position" style={{ listStyleType: 'none' }}>{`${
                      e.page + 1
                    }. ${e.x},${e.y}`}</li>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Row>
      </div>
    </div>
  );
}

export default ManualToolBar;

ManualToolBar.propTypes = {
  positionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPositionList: PropTypes.func.isRequired,
  setFirstPosition: PropTypes.func.isRequired,
  onClickFinishButton: PropTypes.func.isRequired,
  activeKey: PropTypes.number.isRequired,
  setActiveKey: PropTypes.func.isRequired,
};
