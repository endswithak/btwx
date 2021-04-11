import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { closeEaseEditorThunk } from '../store/actions/easeEditor';
import IconButton from './IconButton';

const EaseEditorCloseButton = (): ReactElement => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(closeEaseEditorThunk());
  }

  return (
    <IconButton
      iconName='close'
      onClick={handleClick}
      label='close' />
  );
}

export default EaseEditorCloseButton;