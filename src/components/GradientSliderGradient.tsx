/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeContext } from './ThemeProvider';
import chroma from 'chroma-js';

interface GradientSliderGradientProps {
  stops: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  onSliderClick(stop: em.GradientStop): void;
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
    const leftStop = stops.allIds.reduce((result, current) => {
      if (stops.byId[current].position <= position && position - stops.byId[current].position < leftDistance) {
        result = stops.byId[current];
        leftDistance = position - stops.byId[current].position;
      }
      return result;
    }, stops.byId[stops.allIds[0]]);
    let rightDistance = 999999999;
    const rightStop = stops.allIds.reduce((result, current) => {
      if (stops.byId[current].position >= position && stops.byId[current].position - position < rightDistance) {
        result = stops.byId[current];
        rightDistance = stops.byId[current].position - position;
      }
      return result;
    }, stops.byId[stops.allIds[0]]);
    const id = uuidv4();
    const color = chroma.average([leftStop.color, rightStop.color]).hex();
    const newStop = { id, position, color, active: false };
    onSliderClick(newStop);
  }

  return (
    <div
      className='c-gradient-slider__gradient'
      onClick={handleClick}
      style={{
        background: (() => {
          return [...stops.allIds].sort((a,b) => { return stops.byId[a].position - stops.byId[b].position }).reduce((result, current, index) => {
            result = result + `${stops.byId[current].color} ${stops.byId[current].position * 100}%`;
            if (index !== stops.allIds.length - 1) {
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