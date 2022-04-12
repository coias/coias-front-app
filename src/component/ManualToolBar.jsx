import { React, useContext } from 'react';
import { Button, Container, Row, Col, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext } from './context';

function ManualToolBar({ positionList, setPositionList }) {
  const { setCurrentPage } = useContext(PageContext);
  const onClickAddButton = () => {
    setCurrentPage(0);
    const lastEl = positionList[positionList.length - 1];
    if (positionList.length === 0 || lastEl.length === 5)
      setPositionList([...positionList, []]);
  };
  return (
    <div>
      <Container fluid>
        <Row className="m-4">
          <Col
            className="d-flex justify-content-between"
            style={{ background: 'white' }}
          >
            <p>惑星一覧</p>
            <Button
              variant="success"
              onClick={() => {
                onClickAddButton();
              }}
            >
              +
            </Button>
          </Col>
        </Row>
        <Row>
          <Accordion defaultActiveKey="0">
            {positionList
              .map((d) => d)
              .map((d, index) => (
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>#{index}</Accordion.Header>
                  <Accordion.Body>
                    {d.map((e) => {
                      const pos = e.currentMousePos;
                      return (
                        <li
                          id="position"
                          style={{ listStyleType: 'decimal' }}
                        >{`${pos.x},${pos.y}`}</li>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
        </Row>
      </Container>
    </div>
  );
}

export default ManualToolBar;

ManualToolBar.propTypes = {
  positionList: PropTypes.objectOf(PropTypes.object).isRequired,
  setPositionList: PropTypes.func.isRequired,
};
