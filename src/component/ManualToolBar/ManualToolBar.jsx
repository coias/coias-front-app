import { React } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import AsteroidList from '../AsteroidList/AsteroidList';
import styles from './ManualToolBar.module.scss';

function ManualToolBar() {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col style={{ background: 'white' }}>
            <p className={styles.title}>惑星一覧</p>
          </Col>
          <Col xs lg="2">
            <Button variant="success" className={styles.button}>
              +
            </Button>
          </Col>
        </Row>
        <Row>
          <AsteroidList />
        </Row>
      </Container>
    </div>
  );
}

export default ManualToolBar;
