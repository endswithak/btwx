import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import TopbarButton from './TopbarButton';

const ZoomInButton = (): ReactElement => {
  const dispatch = useDispatch();

  return (
    <TopbarButton
      hideLabel
      label='Zoom In'
      onClick={() => dispatch(zoomInThunk())}
      icon='zoom-in'
      />
  );
}

export default ZoomInButton;