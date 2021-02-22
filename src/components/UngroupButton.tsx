import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';
import StackedButton from './StackedButton';
import Icon from './Icon';

const UngroupButton = (): ReactElement => {
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  const dispatch = useDispatch();

  const handleUngroupClick = (): void => {
    if (canUngroup) {
      dispatch(ungroupSelectedThunk());
    }
  }

  return (
    <StackedButton
      label='Ungroup'
      onClick={handleUngroupClick}
      disabled={!canUngroup}
      size='small'>
      <Icon
        name='ungroup'
        size='small' />
    </StackedButton>
  );
}

export default UngroupButton;