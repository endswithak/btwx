/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersGradientStop } from '../store/actions/layer';
import { RemoveLayersGradientStopPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface GradientSliderProps {
  activeStopIndex: number;
  disabled: boolean;
  layers?: string[];
  prop?: 'fill' | 'stroke';
  removeLayersGradientStop?(payload: RemoveLayersGradientStopPayload): LayerTypes;
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
  const { layers, disabled, removeLayersGradientStop, activeStopIndex, prop } = props;

  const removeStop = () => {
    removeLayersGradientStop({layers, prop, stopIndex: activeStopIndex});
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

const mapStateToProps = (state: RootState) => {
  const { gradientEditor } = state;
  const layers = gradientEditor.layers;
  const prop = gradientEditor.prop;
  return { layers, prop };
};

export default connect(
  mapStateToProps,
  { removeLayersGradientStop }
)(GradientSliderRemove);