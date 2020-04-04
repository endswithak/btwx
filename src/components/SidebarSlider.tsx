import React, { useContext, ReactElement, SyntheticEvent } from 'react';
import { store } from '../store';
import styled from 'styled-components';

interface SidebarSliderProps {
  value: number | string;
  step?: number;
  min?: number;
  max?: number;
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
}

const Slider = styled.input`
  -webkit-appearance: none;
  margin: 0;
  background: none;
  width: 100%;
  :focus {
    outline: none;
  }
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: ${props => props.theme.unit}px;
    cursor: pointer;
    background: linear-gradient(to right, ${props => props.theme.palette.primary} ${props => props.value}%, ${props => props.theme.background.z4} ${props => props.value}%);
    border-radius: ${props => props.theme.unit * 2}px;
  }
  ::-webkit-slider-thumb {
    box-shadow: 0px 0px 5px ${props => props.theme.background.z0};
    height: ${props => props.theme.unit * 3}px;
    width: ${props => props.theme.unit * 3}px;
    border-radius: 100%;
    background: ${props => props.theme.backgroundInverse.z6};
    cursor: pointer;
    -webkit-appearance: none;
    transform: translateY(-36%);
  }
  :hover::-webkit-slider-thumb {
    background: ${props => props.theme.backgroundInverse.z3};
  }
`;

const SidebarSlider = (props: SidebarSliderProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

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