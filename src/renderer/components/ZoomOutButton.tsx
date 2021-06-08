import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomOutThunk } from '../store/actions/zoomTool';
import StackedButton from './StackedButton';
import Icon from './Icon';

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
      size='small'>
      <Icon
        name='zoom-out'
        size='small' />
    </StackedButton>
  );
}

export default ZoomOutButton;