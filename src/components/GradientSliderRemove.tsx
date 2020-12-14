/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersGradientStop } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface GradientSliderProps {
  activeStopIndex: number;
  disabled: boolean;
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
  const { disabled, activeStopIndex } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const prop = useSelector((state: RootState) => state.gradientEditor.prop);
  const dispatch = useDispatch();

  const removeStop = () => {
    dispatch(removeLayersGradientStop({layers: selected, prop, stopIndex: activeStopIndex}));
  }

  return (
    <Button
      onClick={removeStop}
      disabled={disabled}
      className='c-gradient-slider__remove'
      theme={theme}>
      <Icon name='trash-can' />
    </Button>
  );
}

export default GradientSliderRemove;