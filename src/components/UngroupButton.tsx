import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

const UngroupButton = (): ReactElement => {
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  const dispatch = useDispatch();

  const handleUngroupClick = (): void => {
    if (canUngroup) {
      dispatch(ungroupSelectedThunk());
    }
  }

  return (
    <TopbarButton
      label='Ungroup'
      onClick={handleUngroupClick}
      icon='ungroup'
      disabled={!canUngroup} />
  );
}

export default UngroupButton;