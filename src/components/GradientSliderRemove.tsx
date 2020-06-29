/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface GradientSliderProps {
  stops: em.GradientStop[];
  activeStopIndex: number;
  disabled: boolean;
  setStops(stops: em.GradientStop[]): void;
  setActivePickerColor(color: string): void;
  setActiveStopIndex(index: number): void;
}

const Button = styled.button`
  svg {
    fill: ${props => props.theme.text.lighter};
    :hover {
      fill: ${props => props.theme.text.base};
    }
  }
  :disabled {
    opacity: 0.5;
    cursor: default;
    svg {
      :hover {
        fill: ${props => props.theme.text.lighter};
      }
    }
  }
`;

const GradientSliderRemove = (props: GradientSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { stops, setStops, activeStopIndex, disabled, setActivePickerColor, setActiveStopIndex } = props;

  const removeStop = () => {
    const newStops = stops.filter((stop, index) => index !== activeStopIndex);
    setStops(newStops);
    setActiveStopIndex(0);
    setActivePickerColor(newStops[0].color);
  }

  return (
    <Button
      onClick={removeStop}
      disabled={disabled}
      className='c-fill-editor__remove-stop'
      theme={theme}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'>
        <path d='M19,8 L17.5555556,20 L7.44444444,20 L6,8 L19,8 Z M16,10 L15,10 L15,18 L16,18 L16,10 Z M13,10 L12,10 L12,18 L13,18 L13,10 Z M10,10 L9,10 L9,18 L10,18 L10,10 Z M6,7 L6,6 L10,6 L10,4 L15,4 L15,6 L19,6 L19,7 L6,7 Z M14,5 L11,5 L11,6 L14,6 L14,5 Z' />
      </svg>
    </Button>
  );
}

export default GradientSliderRemove;