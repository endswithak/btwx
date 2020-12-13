import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomOutThunk } from '../store/actions/zoomTool';
import TopbarButton from './TopbarButton';

const ZoomOutButton = (): ReactElement => {
  const canZoomOut = useSelector((state: RootState) => state.documentSettings.matrix[0] === 0.01);
  const dispatch = useDispatch();

  const handleZoomOutClick = (): void => {
    if (canZoomOut) {
      dispatch(zoomOutThunk());
    }
  }

  return (
    <TopbarButton
      hideLabel
      label='Zoom Out'
      onClick={handleZoomOutClick}
      disabled={!canZoomOut}
      icon='zoom-out'
      />
  );
}

export default ZoomOutButton;