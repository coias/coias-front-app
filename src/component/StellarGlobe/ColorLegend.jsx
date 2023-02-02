import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { IoSquareSharp } from 'react-icons/io5';

function ColorLegend({ TRACT_PATCH_COLORS }) {
  const rgb2hex = (rgb) =>
    `#${rgb
      .map((value) => `0${Math.floor(value * 255).toString(16)}`.slice(-2))
      .join('')}`;

  const [HexadecimalStringColors, setHexadecimalStringColors] = useState([]);
  useEffect(() => {
    setHexadecimalStringColors(
      TRACT_PATCH_COLORS.map((item) => {
        const color = rgb2hex(item.color);
        const { comment } = item;
        return { color, comment };
      }),
    );
  }, []);

  return (
    <div
      style={{
        opacity: 0.9,
        width: '150px',
        height: '150px',
        color: 'black',
        backgroundColor: 'white',
        position: 'absolute',
        top: '100px',
        right: '100px',
        zIndex: 999,
        padding: '6px',
        display: 'flex',
        margin: 'auto 0',
      }}
    >
      <table>
        <tbody>
          {HexadecimalStringColors.map((item) => (
            <tr>
              <td>
                <IoSquareSharp size={22} color={item.color} />
              </td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColorLegend;

ColorLegend.propTypes = {
  TRACT_PATCH_COLORS: PropTypes.objectOf(PropTypes.array).isRequired,
};
