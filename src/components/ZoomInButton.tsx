import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import StackedButton from './StackedButton';
import Icon from './Icon';

const ZoomInButton = (): ReactElement => {
  const dispatch = useDispatch();

  return (
    <StackedButton
      label='Zoom In'
      onClick={() => dispatch(zoomInThunk())}
      size='small'>
      <Icon
        name='zoom-in'
        size='small' />
    </StackedButton>
  );
}

export default ZoomInButton;