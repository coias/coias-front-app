import PropTypes from 'prop-types';
import { BiTime } from 'react-icons/bi';
import React, { useContext } from 'react';
import { PageContext } from '../functional/context';

function ImageTimes({ timeList }) {
  const { currentPage } = useContext(PageContext);

  return timeList.length > 0 ? (
    <div
      style={{
        opacity: 0.5,
        width: '190px',
        height: '35px',
        color: 'white',
        backgroundColor: 'black',
        position: 'absolute',
        top: '0px',
        right: '140px',
        zIndex: 999,
        padding: '6px',
        display: 'flex',
        margin: 'auto 0',
      }}
    >
      <BiTime size={22} style={{ marginRight: '5px' }} />
      {`${timeList[currentPage]}`}
    </div>
  ) : null;
}

export default ImageTimes;

ImageTimes.propTypes = {
  timeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
