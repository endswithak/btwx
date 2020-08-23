/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

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
    // const newStops = stops.filter((stop, index) => index !== activeStopIndex);
    // setStops(newStops);
    // setActiveStopIndex(0);
    // setActivePickerColor(newStops[0].color);
  }

  return (
    <Button
      onClick={removeStop}
      disabled={disabled}
      className='c-fill-editor__remove-stop'
      theme={theme}>
      <Icon name='trash-can' />
    </Button>
  );
}

export default GradientSliderRemove;