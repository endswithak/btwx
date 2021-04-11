/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
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

const GradientSlider = ({
  gradientStops,
  activeStopIndex,
  onStopPress,
  onStopDrag,
  onSliderClick
}: GradientSliderProps): ReactElement => (
  <div className='c-gradient-slider'>
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

export default GradientSlider;