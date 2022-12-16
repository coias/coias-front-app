/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { StarPositionContext, PageContext } from '../../functional/context';

function DeleteStarModal({
  show,
  onExit,
  onExited,
  deleteNameList,
  onClickSetButton,
}) {
  const { starPos } = useContext(StarPositionContext);
  const { currentPage } = useContext(PageContext);
  const [deleteFlags, setDeleteFlags] = useState([]);
  const readDeleteFlags = () => {
    const deleteObjectList = [];
    deleteNameList.forEach((thisName) => {
      const tmpDeleteObject = {
        name: thisName,
        page: currentPage,
        isDeleted: starPos[thisName].page[currentPage].isDeleted,
      };
      deleteObjectList.push(tmpDeleteObject);
    });
    setDeleteFlags(deleteObjectList);
  };
  useEffect(readDeleteFlags, [starPos, deleteNameList, currentPage]);

  return (
    <Modal
      show={show}
      onExit={() => {
        onExit();
      }}
      onExited={() => {
        onExited();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {`承認済み自動検出天体の削除 (${currentPage + 1}枚目)`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onClickSetButton(deleteFlags);
          }}
        >
          <Form.Label>
            クリックした承認済み自動検出天体のうち削除したいものにチェックをつけてください。
          </Form.Label>
          <Row>
            <Col style={{ textAlign: 'center' }}>天体名</Col>
            <Col style={{ textAlign: 'center' }}>削除する</Col>
          </Row>
          <hr />
          {deleteFlags.map((item) => (
            <Row key={item.name} className="mb-2">
              <Col style={{ textAlign: 'center' }}>{item.name}</Col>
              <Col className="text-center">
                <Form.Check
                  type="checkbox"
                  defaultChecked={item.isDeleted}
                  onChange={(e) => {
                    // eslint-disable-next-line no-param-reassign
                    item.isDeleted = e.target.checked;
                  }}
                />
              </Col>
            </Row>
          ))}
          <Form.Group
            className="m-3"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            controlId="formBasicCheckbox"
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                readDeleteFlags();
                onExit();
              }}
            >
              キャンセル
            </Button>
            <Button variant="success" type="submit">
              設定
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
  onClickSetButton: PropTypes.func.isRequired,
};
