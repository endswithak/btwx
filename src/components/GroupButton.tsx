import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { groupSelectedThunk } from '../store/actions/layer';
import { canGroupSelected } from '../store/selectors/layer';
import StackedButton from './StackedButton';

const GroupButton = (): ReactElement => {
  const canGroup = useSelector((state: RootState) => canGroupSelected(state));
  const dispatch = useDispatch();

  const handleGroupClick = () => {
    if (canGroup) {
      dispatch(groupSelectedThunk());
    }
  }

  return (
    <StackedButton
      label='Group'
      onClick={handleGroupClick}
      iconName='group'
      disabled={!canGroup}
      size='small' />
  );
}

export default GroupButton;