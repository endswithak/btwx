/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarToggleButton from './SidebarToggleButton';

interface ColorPickerTypeToggleProps {
  type: 'rgb' | 'hsl';
  setType: any;
}

const ColorPickerTypeToggle = (props: ColorPickerTypeToggleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { type, setType } = props;

  const handleClick = () => {
    if (type === 'rgb') {
      setType('hsl');
    } else if (type === 'hsl') {
      setType('rgb');
    }
  }

  return (
    <SidebarToggleButton
      onClick={handleClick}
      active={false}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        style={{
          fill: theme.text.lighter,
          transform: `scale(0.75)`
        }}>
        <path d='M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z' />
      </svg>
    </SidebarToggleButton>
  );
}

export default ColorPickerTypeToggle;