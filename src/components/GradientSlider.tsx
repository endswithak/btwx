/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import GradientSliderStop from './GradientSliderStop';
import GradientSliderGradient from './GradientSliderGradient';
import GradientSliderRemove from './GradientSliderRemove';

interface GradientSliderProps {
  gradientStops: Btwx.GradientStop[];
  activeStopIndex: number;
  onStopPress(index: number): void;
  onStopDrag(index: number, position: number): void;
  onSliderClick(stop: Btwx.GradientStop): void;
}

const GradientSlider = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { gradientStops, activeStopIndex, onStopPress, onStopDrag, onSliderClick } = props;

  return (
    <div
      className='c-gradient-slider'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div
        id='c-gradient-slider__slider'
        className='c-gradient-slider__slider'>
        <GradientSliderGradient
          stops={gradientStops}
          onSliderClick={onSliderClick} />
        {
          gradientStops.map((stop, index) => (
            <GradientSliderStop
              stop={stop}
              index={index}
              activeStopIndex={activeStopIndex}
              onStopPress={onStopPress}
              onStopDrag={onStopDrag}
              key={index}
              />
          ))
        }
      </div>
      <GradientSliderRemove
        disabled={gradientStops.length <= 2}
        activeStopIndex={activeStopIndex} />
    </div>
  );
}

export default GradientSlider;