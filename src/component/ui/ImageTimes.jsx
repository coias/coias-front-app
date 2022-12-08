import PropTypes from 'prop-types';
import { BiTime } from 'react-icons/bi';
import React, { useContext } from 'react';
import { PageContext } from '../functional/context';

function ImageTimes({ timeList }) {
  const { currentPage } = useContext(PageContext);

  return (
    <div
      style={{
        opacity: 0.5,
        width: '230px',
        height: '35px',
        color: 'white',
        backgroundColor: 'black',
        position: 'absolute',
        top: '0px',
        right: '180px',
        zIndex: 999,
        padding: '6px',
      }}
    >
      <BiTime size={22} style={{ marginRight: '5px' }} />
      {`${timeList[currentPage]}`}
    </div>
  );
}

export default ImageTimes;

ImageTimes.propTypes = {
  timeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
