import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomOutThunk } from '../store/actions/zoomTool';
import StackedButton from './StackedButton';

const ZoomOutButton = (): ReactElement => {
  const canZoomOut = useSelector((state: RootState) => state.documentSettings.zoom !== 0.01);
  const dispatch = useDispatch();

  const handleZoomOutClick = (): void => {
    if (canZoomOut) {
      dispatch(zoomOutThunk());
    }
  }

  return (
    <StackedButton
      label='Zoom Out'
      onClick={handleZoomOutClick}
      disabled={!canZoomOut}
      iconName='zoom-out'
      size='small' />
  );
}

export default ZoomOutButton;