import { React, useContext, useCallback } from 'react';
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
  onClickFinishButton,
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

  const removePositionListByCheckState = () => {
    document.getElementById('wrapper-coias').focus();

    const isAllRemove = !checkedState.some((element) => element === false);

    if (isAllRemove) {
      setPositionList([[]]);
      onClickFinishButton([[]]);
      setActiveKey(0);
      setCheckedState([false]);
    } else {
      const filteredList = positionList.filter(
        (elementPosition, index) => !checkedState[index],
      );
      setPositionList(filteredList);
      onClickFinishButton(filteredList);
      setActiveKey(filteredList.length - 1);
      setCheckedState(checkedState.filter((element) => !element));
    }
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
              <div className="d-flex" key={uuidv4()}>
                <Form.Check
                  key={uuidv4()}
                  style={{ marginTop: '20px' }}
                  onChange={() => handleOnChange(index)}
                  checked={checkedState[index]}
                />
                <Accordion.Item
                  key={uuidv4()}
                  eventKey={index.toString()}
                  onClick={() => onClickAccordion(index)}
                  className="w-100"
                >
                  <Accordion.Header
                    onClick={() =>
                      document.getElementById('wrapper-coias').focus()
                    }
                  >
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
  checkedState: PropTypes.arrayOf(PropTypes.bool).isRequired,
  setCheckedState: PropTypes.func.isRequired,
  onClickFinishButton: PropTypes.func.isRequired,
};
