import { React, useContext, useState, useCallback } from 'react';
import { Button, Row, Col, Accordion, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BiAddToQueue } from 'react-icons/bi';
import { PageContext } from './context';

function ManualToolBar({
  positionList,
  setPositionList,
  activeKey,
  setActiveKey,
  leadStarNumber,
}) {
  const { currentPage } = useContext(PageContext);
  const [checkedState, setCheckedState] = useState([false]);

  const onClickAccordion = (index) => {
    setActiveKey(index);
  };

  const onClickAddButton = () => {
    setPositionList([...positionList, []]);
    setCheckedState([...checkedState, false]);
    setActiveKey(positionList.length);
  };

  const removePositionListByCheckState = () => {
    setPositionList(
      positionList.filter((elementPosition, index) => !checkedState[index]),
    );
    setCheckedState(checkedState.filter((element) => !element));
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item,
    );

    setCheckedState(updatedCheckedState);
  };

  const isEditMode = useCallback(
    () => checkedState.find((element) => element === true),
    [checkedState],
  );

  return (
    <div>
      <Row className="m-3">
        <Col
          className="d-flex justify-content-between"
          style={{ background: 'white', padding: 0 }}
        >
          <p style={{ margin: 'auto 0' }}>天体一覧</p>
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
      <div className="manual-list">
        <Row>
          <Accordion activeKey={`${activeKey}`}>
            {positionList.map((d, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="d-flex" key={index}>
                <Form.Check
                  style={{ marginTop: '20px' }}
                  onChange={() => handleOnChange(index)}
                  checked={checkedState[index]}
                />
                <Accordion.Item
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
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
      {isEditMode() && (
        <Button
          variant="danger"
          onClick={() => {
            removePositionListByCheckState();
          }}
        >
          削除する
        </Button>
      )}
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
};
