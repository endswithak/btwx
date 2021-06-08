import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { togglePreviewDeviceOrientation } from '../store/actions/preview';
import IconButton from './IconButton';

const PreviewDeviceOrientationButton = (): ReactElement => {
  const device = useSelector((state: RootState) => state.preview.device.id);
  const orientation = useSelector((state: RootState) => state.preview.device.orientation);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(togglePreviewDeviceOrientation());
  }

  return (
    <IconButton
      size='small'
      onClick={handleClick}
      disabled={!device}
      isActive={orientation === 'Landscape'}
      iconName='mobile-landscape'
      toggle />
  );
}

export default PreviewDeviceOrientationButton;