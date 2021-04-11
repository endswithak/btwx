/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeLayersGradientStop } from '../store/actions/layer';
import IconButton from './IconButton';

interface GradientSliderProps {
  activeStopIndex: number;
  disabled: boolean;
}

const GradientSliderRemove = (props: GradientSliderProps): ReactElement => {
  const { disabled, activeStopIndex } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const prop = useSelector((state: RootState) => state.gradientEditor.prop);
  const dispatch = useDispatch();

  const removeStop = () => {
    dispatch(removeLayersGradientStop({layers: selected, prop, stopIndex: activeStopIndex}));
  }

  return (
    <IconButton
      onClick={removeStop}
      disabled={disabled}
      iconName='trash-can'
      label='delete stop' />
  );
}

export default GradientSliderRemove;