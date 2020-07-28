import React, { useContext, ReactElement, SyntheticEvent } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface SidebarSliderProps {
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
  onMouseUp?(e: React.SyntheticEvent<HTMLInputElement>): void;
  disabled?: boolean;
  bottomSpace?: boolean;
}

interface SliderProps {
  value: number;
  step?: number;
  min?: number;
  max?: number;
  bottomSpace?: boolean;
}

const Slider = styled.input<SliderProps>`
  -webkit-appearance: none;
  margin: 0;
  background: none;
  width: 100%;
  margin-bottom: ${props => props.bottomSpace ? 20 : 0}px;
  :focus {
    outline: none;
  }
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: ${props => props.theme.unit}px;
    cursor: pointer;
    background: linear-gradient(to right, ${props => props.theme.palette.primary} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%, ${props => props.theme.background.z3} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%);
    border-radius: ${props => props.theme.unit * 2}px;
    box-shadow: none;
  }
  :disabled::-webkit-slider-runnable-track {
    cursor: inherit;
  }
  ::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 5px ${props => props.theme.background.z0}; */
    box-shadow: 0 0 0 1.5px ${props => props.theme.name === 'dark' ? props.theme.backgroundInverse.z6 : props.theme.background.z0}, 0 0 1px 2px rgba(0,0,0,.4);
    height: ${props => props.theme.unit * 3}px;
    width: ${props => props.theme.unit * 3}px;
    border-radius: 100%;
    background: ${props => props.theme.name === 'dark' ? props.theme.backgroundInverse.z6 : props.theme.background.z0};
    cursor: pointer;
    -webkit-appearance: none;
    transform-origin: center top;
    transform: translateY(-37%);
  }
  :disabled::-webkit-slider-thumb {
    cursor: inherit;
  }
  :hover {
    ::-webkit-slider-runnable-track {
      background: linear-gradient(to right, ${props => props.theme.palette.primaryHover} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%, ${props => props.theme.background.z4} ${props => props.max ? ((props.min ? props.value - props.min : props.value) / (props.min ? props.max - props.min : props.max)) * 100 : props.value}%);
    }
  }
`;

const SidebarSlider = (props: SidebarSliderProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-sidebar-input'>
      <div className='c-sidebar-input__inner'>
        <Slider
          {...props}
          type='range'
          theme={theme} />
      </div>
    </div>
  );
}

export default SidebarSlider;