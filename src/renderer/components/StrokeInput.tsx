import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedStrokeFillType } from '../store/selectors/layer';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';
import MultiInput from './MultiInput';

const StrokeInput = (): ReactElement => {
  const strokeFillType = useSelector((state: RootState) => getSelectedStrokeFillType(state));

  switch(strokeFillType) {
    case 'color':
      return <ColorInput prop='stroke' />
    case 'gradient':
      return <GradientInput prop='stroke' />
    case 'multi':
      return <MultiInput prop='stroke' />
  }
}

export default StrokeInput;