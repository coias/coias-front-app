import { React, useContext } from 'react';
import { Button, Row, Col, Accordion, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { BiAddToQueue } from 'react-icons/bi';
import { PageContext } from './context';

function ManualToolBar({
  positionList,
  setPositionList,
  activeKey,
  setActiveKey,
  leadStarNumber,
  checkedState,
  setCheckedState,
}) {
  const { currentPage } = useContext(PageContext);

  const onClickAccordion = (index) => {
    setActiveKey(index);
  };

  const onClickAddButton = () => {
    // TODO : 動的に確保する ５->N
    setPositionList([...positionList, []]);
    setCheckedState([...checkedState, false]);
    setActiveKey(positionList.length);
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item,
    );
    setCheckedState(updatedCheckedState);
  };

  return (
    <div>
      <Row className="m-3">
        <Col className="d-flex justify-content-between">
          <p style={{ margin: 'auto 0', fontWeight: 'bold', color: '#5C636A' }}>
            天体一覧
          </p>
          <Button
            variant="success"
            onClick={() => {
              onClickAddButton();
            }}
          >
            <BiAddToQueue size={30} />
          </Button>
        </Col>
      </Row>
      <div className="manual-list m-1">
        <Row>
          <Accordion activeKey={`${activeKey}`} className="mt-1">
            {positionList.map((d, index) => (
              <div className="d-flex m-2" key={uuidv4()}>
                <Form.Check
                  key={uuidv4()}
                  style={{ marginTop: '13px', marginRight: '5px' }}
                  onChange={() => handleOnChange(index)}
                  checked={checkedState[index]}
                />
                <Accordion.Item
                  key={uuidv4()}
                  eventKey={index.toString()}
                  onClick={() => onClickAccordion(index)}
                  className="w-100"
                >
                  <Accordion.Header>
                    {`#H${'000000'.slice(
                      (leadStarNumber + index).toString().length - 6,
                    )}${leadStarNumber + index}`}
                  </Accordion.Header>
                  <Accordion.Body>
                    {d
                      .sort((a, b) => {
                        const keyA = a.page;
                        const keyB = b.page;
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                      })
                      .map((e) => (
                        <li
                          id="position"
                          key={e.page}
                          style={{
                            listStyleType: 'none',
                            color: e.page === currentPage ? 'red' : '',
                          }}
                        >{`${e.page + 1}. ${e.x},${e.y}`}</li>
                      ))}
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            ))}
          </Accordion>
        </Row>
      </div>
    </div>
  );
}

export default ManualToolBar;

ManualToolBar.propTypes = {
  positionList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
    .isRequired,
  setPositionList: PropTypes.func.isRequired,
  activeKey: PropTypes.number.isRequired,
  leadStarNumber: PropTypes.number.isRequired,
  setActiveKey: PropTypes.func.isRequired,
  checkedState: PropTypes.arrayOf(PropTypes.bool).isRequired,
  setCheckedState: PropTypes.func.isRequired,
};
