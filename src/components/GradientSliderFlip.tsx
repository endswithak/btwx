/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { flipLayersGradient } from '../store/actions/layer';
import IconButton from './IconButton';

const GradientSliderFlip = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const prop = useSelector((state: RootState) => state.gradientEditor.prop);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(flipLayersGradient({
      layers: selected,
      prop
    }));
  }

  return (
    <IconButton
      onClick={handleClick}
      iconName='autoplay'
      size='small'
      label='flip gradient' />
  );
}

export default GradientSliderFlip;