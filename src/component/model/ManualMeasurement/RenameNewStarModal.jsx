/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import {
  StarPositionContext,
  PredictedStarPositionContext,
} from '../../functional/context';
import CONSTANT from '../../../utils/CONSTANTS';

function RenameNewStarModal({
  show,
  onExit,
  onClickRenameButton,
  oldStarName,
  isAlreadyChanged,
}) {
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const searchWrapperRef = useRef(null);
  const handleClickOutside = (event) => {
    const { current: wrap } = searchWrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateSearchName = (selectedName) => {
    setSearch(selectedName);
    setDisplay(false);
  };

  const { starPos } = useContext(StarPositionContext);
  const { predictedStarPos } = useContext(PredictedStarPositionContext);
  const [renameStarPos, setRenameStarPos] = useState({});
  useEffect(() => {
    setRenameStarPos(starPos);
    if (Object.keys(predictedStarPos).length !== 0) {
      const exclusivePredictedStarPos = Object.keys(predictedStarPos)
        .map((key) => predictedStarPos[key])
        .filter((pos) => !Object.keys(starPos).includes(pos.name));
      setRenameStarPos(Object.assign(starPos, exclusivePredictedStarPos));
    }
  }, [starPos]);

  return (
    <Modal
      show={show}
      onExit={() => {
        onExit();
        updateSearchName('');
        setErrorMessage('');
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="f-modal_title f-ja"
        >
          天体名の付け替え
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (isAlreadyChanged) {
              onClickRenameButton(oldStarName);
            } else if (
              !isAlreadyChanged &&
              Object.values(renameStarPos).some(
                (starContent) => starContent.name === search,
              )
            ) {
              onClickRenameButton(search);
            } else {
              setErrorMessage('他の天体と名前が一致しません');
            }
          }}
        >
          <Form.Label className="f-ja">
            {`${oldStarName}の名前を変更します。変更後の名前を選んでください。`}
          </Form.Label>
          <Row style={{ marginBottom: '40px' }}>
            <Col
              className="d-flex justify-content-center"
              style={{ alineItems: 'center' }}
            >
              <h3 style={{ marginBottom: 0 }} className="f-en">
                {oldStarName}
              </h3>
            </Col>
            <Col className="d-flex justify-content-center">
              {isAlreadyChanged ? (
                <AiOutlineArrowLeft
                  size={CONSTANT.iconSize40px}
                  color={CONSTANT.btnColorGray}
                />
              ) : (
                <AiOutlineArrowRight
                  size={CONSTANT.iconSize40px}
                  color={CONSTANT.btnColorGray}
                />
              )}
            </Col>
            <Col>
              <div
                ref={searchWrapperRef}
                className="flex-container flex-column pos-rel f-en"
              >
                <Form.Control
                  id="auto"
                  required
                  onClick={() => {
                    setDisplay(!display);
                    setErrorMessage('');
                  }}
                  placeholder="Type to search"
                  onChange={(event) => setSearch(event.target.value)}
                  onBlur={handleClickOutside}
                  maxLength={7}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  value={
                    isAlreadyChanged ? starPos[oldStarName].newName : search
                  }
                  disabled={isAlreadyChanged}
                  autoComplete="off"
                  size="lg"
                />
                {errorMessage !== '' && (
                  <p style={{ color: 'red' }}>{errorMessage}</p>
                )}
                {display && (
                  <div
                    style={{
                      height: '30vh',
                      overflowY: 'scroll',
                    }}
                    className="search_suggestions"
                  >
                    {Object.values(renameStarPos)
                      .filter(
                        (star) =>
                          star.name
                            .toLowerCase()
                            .indexOf(oldStarName.toLowerCase()) === -1,
                      )
                      .filter(
                        (star) =>
                          star.name
                            .toLowerCase()
                            .indexOf(search.toLowerCase()) > -1,
                      )
                      .map((value) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                          onClick={() => updateSearchName(value.name)}
                          key={`${value.page}${value.name}`}
                          tabIndex="0"
                        >
                          <span>{value.name}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Form.Group
            className="m-3"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            controlId="formBasicCheckbox"
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onExit();
              }}
              className="btn-style box_border_blue f-ja"
            >
              戻る
            </Button>
            <Button
              variant="success"
              type="submit"
              className="btn-style box_blue f-ja"
            >
              {isAlreadyChanged ? '名前を元に戻す' : '名前を付け替える'}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RenameNewStarModal;

RenameNewStarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  oldStarName: PropTypes.string.isRequired,
  isAlreadyChanged: PropTypes.bool.isRequired,
};
