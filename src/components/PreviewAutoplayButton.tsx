import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enablePreviewAutoplay, disablePreviewAutoplay } from '../store/actions/preview';
import IconButton from './IconButton';

const PreviewAutoplayButton = (): ReactElement => {
  const autoplay = useSelector((state: RootState) => state.preview.autoplay);
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(autoplay ? disablePreviewAutoplay() : enablePreviewAutoplay());
  }

  return (
    <IconButton
      onClick={handleClick}
      iconName='autoplay'
      size='small'
      toggle
      isActive={autoplay}
      label='autoplay' />
  );
}

export default PreviewAutoplayButton;