import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { StarPositionContext } from '../component/context';

function Report() {
  const { starPos } = useContext(StarPositionContext);

  return (
    <Row xs="auto">
      <Col>
        <h4>レポート:</h4>
      </Col>
      <Col>
        <Scrollbars
          style={{
            backgroundColor: 'black',
            width: '1000px',
            height: '1000px',
          }}
        >
          <div
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '1000px',
            }}
          >
            <ul style={{ listStyleType: 'none', color: 'white' }}>
              {starPos
                .filter((pos) => pos[4])
                .map((pos) => (
                  <li key={pos[2]}>{pos}</li>
                ))}
            </ul>
          </div>
        </Scrollbars>
      </Col>
    </Row>
  );
}

export default Report;
