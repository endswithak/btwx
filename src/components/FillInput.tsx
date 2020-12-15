import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedStrokeFillType } from '../store/selectors/layer';
import GradientInput from './GradientInput';
import ColorInput from './ColorInput';
import MultiInput from './MultiInput';

const FillInput = (): ReactElement => {
  const fillType = useSelector((state: RootState) => getSelectedStrokeFillType(state));

  switch(fillType) {
    case 'color':
      return <ColorInput prop='fill' />
    case 'gradient':
      return <GradientInput prop='fill' />
    case 'multi':
      return <MultiInput prop='fill' />
  }
}

export default FillInput;