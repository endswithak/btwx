/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import chroma from 'chroma-js';

interface GradientSliderGradientProps {
  stops: em.GradientStop[];
  setStops(stops: em.GradientStop[]): void;
  setActivePickerColor(color: string): void;
  setActiveStopIndex(index: number): void;
  setActiveStopPos(pos: number): void;
}

const GradientSliderGradient = (props: GradientSliderGradientProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { stops, setStops, setActivePickerColor, setActiveStopIndex, setActiveStopPos } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingBox = document.getElementById('c-gradient-slider__slider').getBoundingClientRect();
    const x = e.clientX - boundingBox.left;
    const position = x / boundingBox.width;
    let leftDistance = 999999999;
    const leftStop = stops.reduce((result, current) => {
      if (current.position <= position && position - current.position < leftDistance) {
        result = current;
        leftDistance = position - current.position;
      }
      return result;
    }, stops[0]);
    let rightDistance = 999999999;
    const rightStop = stops.reduce((result, current) => {
      if (current.position >= position && current.position - position < rightDistance) {
        result = current;
        rightDistance = current.position - position;
      }
      return result;
    }, stops[0]);
    const color = chroma.average([leftStop.color, rightStop.color]).hex();
    const newStop = {position, color};
    const newStops = [...stops, newStop];
    setStops(newStops);
    setActiveStopIndex(newStops.length - 1);
    setActivePickerColor(color);
    setActiveStopPos(position);
  }

  return (
    <div
      className='c-gradient-slider__gradient'
      onClick={handleClick}
      style={{
        background: (() => {
          return [...stops].sort((a,b) => { return a.position - b.position }).reduce((result, current, index) => {
            result = result + `${current.color} ${current.position * 100}%`;
            if (index !== stops.length - 1) {
              result = result + ',';
            } else {
              result = result + ')';
            }
            return result;
          }, 'linear-gradient(to right,');
        })()
      }} />
  );
}

export default GradientSliderGradient;