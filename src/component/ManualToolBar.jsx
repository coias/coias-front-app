import { React } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import AsteroidList from './AsteroidList';
import styles from './ManualToolBar/ManualToolBar.module.scss';

const AddListButton = () => {};

function ManualToolBar() {
  return (
    <div>
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Row>
          <Col>
            <div className={styles.title}>惑星一覧</div>
          </Col>
          <Col sm="2">
            <Button onClick={AddListButton} variant="success">
              +
            </Button>
          </Col>
        </Row>
        <Row>
          <AsteroidList styles={{ width: '100%' }} />
        </Row>
      </Container>
    </div>
  );
}

export default ManualToolBar;
