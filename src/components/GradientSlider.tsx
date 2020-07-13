/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import GradientSliderStop from './GradientSliderStop';
import GradientSliderRemove from './GradientSliderRemove';
import GradientSliderGradient from './GradientSliderGradient';

interface GradientSliderProps {
  gradientStops: {
    allIds: string[];
    byId: {
      [id: string]: em.GradientStop;
    };
  };
  onStopPress(id: string): void;
  onStopDrag(id: string, position: number): void;
  onSliderClick(stop: em.GradientStop): void;
}

const GradientSlider = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { gradientStops, onStopPress, onStopDrag, onSliderClick } = props;

  return (
    <div
      className='c-gradient-slider'
      style={{
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div
        id='c-gradient-slider__slider'
        className='c-gradient-slider__slider'
        style={{
          boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
        }}>
        <GradientSliderGradient
          stops={gradientStops}
          onSliderClick={onSliderClick} />
        {
          gradientStops.allIds.map((stop, index) => (
            <GradientSliderStop
              stop={gradientStops.byId[stop]}
              onStopPress={onStopPress}
              onStopDrag={onStopDrag}
              key={index}
              />
          ))
        }
      </div>
      {/* <GradientSliderRemove
        stops={stops}
        setStops={setStops}
        setActivePickerColor={setActivePickerColor}
        setActiveStopIndex={setActiveStopIndex}
        disabled={stops.length <= 2}
        activeStopIndex={activeStopIndex} /> */}
    </div>
  );
}

export default GradientSlider;