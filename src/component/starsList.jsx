import React from 'react';
import { Form } from 'react-bootstrap';

function StarsList(props) {
  const state = props;
  return (
    <Form>
      {state.positions.map((pos) => {
        if (state.currentPage === parseInt(pos[1], 10)) {
          if (pos[0].startsWith('K')) {
            return (
              <div className="mb-3">
                <Form.Check
                  disabled
                  type="checkbox"
                  id={pos[0]}
                  label={pos[0]}
                />
              </div>
            );
          }
          return (
            <div className="mb-3">
              <Form.Check type="checkbox" id={pos[0]} label={pos[0]} />
            </div>
          );
        }
        return null;
      })}
    </Form>
  );
}

export default StarsList;
