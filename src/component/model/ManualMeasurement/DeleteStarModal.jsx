/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { StarPositionContext, PageContext } from '../../functional/context';

function DeleteStarModal({ show, onExit, onExited, deleteNameList }) {
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const { currentPage } = useContext(PageContext);

  return (
    <Modal
      show={show}
      onExit={() => {
        onExit();
      }}
      onExited={() => {
        onExited();
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="f-modal_title f-ja"
        >
          {`承認済み自動検出天体の削除 (${currentPage + 1}枚目)`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onExit();
          }}
        >
          <Form.Label style={{ color: '#5c636a' }} className="f-ja">
            クリックした承認済み自動検出天体のうち削除したいものにチェックをつけてください。
            <br />
            (削除した天体は、チェックを外すことで再表示することができます。)
          </Form.Label>
          <Row>
            <Col
              style={{ textAlign: 'center', color: '#5c636a' }}
              className="f-ja"
            >
              天体名
            </Col>
            <Col
              style={{ textAlign: 'center', color: '#5c636a' }}
              className="f-ja"
            >
              削除する
            </Col>
          </Row>
          <hr />
          {Object.keys(starPos)
            .filter((name) => deleteNameList.includes(name))
            .map((item) => {
              const name = item;
              const { isDeleted } = starPos[item].page[currentPage];
              return (
                <Row key={name} className="mb-2 f-en">
                  <Col style={{ textAlign: 'center' }}>{name}</Col>
                  <Col className="text-center">
                    <Form.Check
                      type="checkbox"
                      defaultChecked={isDeleted}
                      onChange={(e) => {
                        const newStarPos = JSON.parse(JSON.stringify(starPos));
                        newStarPos[item].page[currentPage].isDeleted =
                          e.target.checked;
                        setStarPos(newStarPos);
                      }}
                    />
                  </Col>
                </Row>
              );
            })}
          <Form.Group
            className="m-3"
            style={{ display: 'flex', justifyContent: 'end' }}
            controlId="formBasicCheckbox"
          >
            <Button
              variant="danger"
              type="submit"
              className="btn-style box_blue f-ja"
            >
              終了
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteStarModal;

DeleteStarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  deleteNameList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
