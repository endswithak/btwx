/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import tinyColor from 'tinycolor2';

interface GradientSliderGradientProps {
  stops: Btwx.GradientStop[];
  onSliderClick(stop: Btwx.GradientStop): void;
}

const GradientSliderGradient = (props: GradientSliderGradientProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { stops, onSliderClick } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const boundingBox = document.getElementById('c-gradient-slider__slider').getBoundingClientRect();
    const x = e.clientX - boundingBox.left;
    let position = x / boundingBox.width;
    if (position < 0) {
      position = 0;
    } else if (position > 1) {
      position = 1;
    }
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
    const color1 = tinyColor({h: leftStop.color.h, s: leftStop.color.s, l: leftStop.color.l, a: leftStop.color.a});
    const color2 = tinyColor({h: rightStop.color.h, s: rightStop.color.s, l: rightStop.color.l, a: rightStop.color.a});
    const colorAvg = tinyColor.mix(color1, color2, 50);
    const hsl = colorAvg.toHsl();
    const newStop = { position, color: { ...hsl } } as Btwx.GradientStop;
    onSliderClick(newStop);
  }

  return (
    <div
      className='c-gradient-slider__gradient'
      onClick={handleClick}
      style={{
        background: (() => {
          return [...stops].sort((a,b) => { return a.position - b.position }).reduce((result, current, index) => {
            const stopColor = tinyColor({h: current.color.h, s: current.color.s, l: current.color.l, a: current.color.a}).toRgbString();
            result = result + `${stopColor} ${current.position * 100}%`;
            if (index !== stops.length - 1) {
              result = result + ',';
            } else {
              result = result + ')';
            }
            return result;
          }, 'linear-gradient(to right,');
        })(),
        cursor: 'cell'
      }} />
  );
}

export default GradientSliderGradient;