import { React, useContext, useState } from 'react';
import { Button, Container, Row, Col, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext } from './context';

function ManualToolBar({ positionList, setPositionList, setFirstPosition }) {
  const { setCurrentPage } = useContext(PageContext);
  const [activeKey, setActiveKey] = useState(0);

  const onClickAccordion = (index) => {
    setActiveKey(index);
  };

  const onClickAddButton = () => {
    const lastEl = positionList[positionList.length - 1];
    if (positionList.length === 0 || lastEl.length === 5) {
      setPositionList([...positionList, []]);
      setActiveKey(positionList.length);
      setCurrentPage(0);
      setFirstPosition({});
    }
  };

  return (
    <div style={{ width: '280px' }}>
      <Container fluid>
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
                      <li
                        id="position"
                        style={{ listStyleType: 'decimal' }}
                      >{`${e.x},${e.y}`}</li>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ManualToolBar;

ManualToolBar.propTypes = {
  positionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPositionList: PropTypes.func.isRequired,
  setFirstPosition: PropTypes.func.isRequired,
};
