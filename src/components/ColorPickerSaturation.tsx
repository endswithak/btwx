/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import throttle from 'lodash.throttle';

interface ColorPickerSaturationProps {
  hue: number;
  saturation: number;
  value: number;
  lightness: number;
  setSaturation: any;
  setValue: any;
  setLightness: any;
}

const ColorPickerSaturation = (props: ColorPickerSaturationProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, value, lightness, setSaturation, setValue, setLightness } = props;
  const pointerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingBox = containerRef.current.getBoundingClientRect();
    const x = e.pageX;
    const y = e.pageY;
    let left = x - (boundingBox.left + window.pageXOffset);
    let top = y - (boundingBox.top + window.pageYOffset);

    if (left < 0) {
      left = 0
    } else if (left > boundingBox.width) {
      left = boundingBox.width
    }

    if (top < 0) {
      top = 0
    } else if (top > boundingBox.height) {
      top = boundingBox.height
    }

    const s = left / boundingBox.width;
    const v = 1 - (top / boundingBox.height);
    const l = (2 - s) * v / 2;

    setSaturation(s);
    setValue(v);
    setLightness(l);
  }, 50, {});

  const unbindEventListeners = () => {
    window.removeEventListener('mousemove', handleChange)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleChange(e);
    window.addEventListener('mousemove', handleChange)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseUp = (e: MouseEvent) => {
    unbindEventListeners();
  }

  useEffect(() => {
    return () => {
      handleChange.cancel();
      unbindEventListeners();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className='c-color-picker-saturation'
      style={{
        boxShadow: `0 0 0 -1px ${theme.background.z4} inset`
      }}>
      <div
        className='c-color-picker-saturation__color'
        style={{
          background: `hsl(${ hue },100%, 50%)`
        }} />
      <div className='c-color-picker-saturation__white' />
      <div className='c-color-picker-saturation__black' />
      <div
        ref={pointerRef}
        className='c-color-picker-saturation__pointer'
        style={{
          top: `${ -(value * 100) + 100 }%`,
          left: `${
            lightness === 1
            ? 0
            : saturation * 100
          }%`,
        }}>
        <div className='c-color-picker-saturation__circle' />
      </div>
    </div>
  );
}

export default ColorPickerSaturation;