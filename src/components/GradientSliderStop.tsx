/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, forwardRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface GradientSliderProps {
  stop: em.GradientStop;
  activeStop: string;
}

const GradientSliderStop = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { stop, activeStop } = props;

  return (
    <div
      id={`gradient-stop-${stop.id}`}
      className='c-gradient-slider__pointer'>
      <div
        className='c-gradient-slider__circle'
        style={{
          boxShadow: stop.id === activeStop
          ? `0 0 0 1.5px #fff, 0 0 0 3.5px ${theme.palette.primary}, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
          : `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)`
        }} />
    </div>
  );
}

export default GradientSliderStop;