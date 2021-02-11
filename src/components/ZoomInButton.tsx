import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import StackedButton from './StackedButton';

const ZoomInButton = (): ReactElement => {
  const dispatch = useDispatch();

  return (
    <StackedButton
      label='Zoom In'
      onClick={() => dispatch(zoomInThunk())}
      iconName='zoom-in'
      size='small' />
  );
}

export default ZoomInButton;