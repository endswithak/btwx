import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandStrokeOptionsStyles, collapseStrokeOptionsStyles } from '../store/actions/rightSidebar';
import ToggleIconButton from './ToggleIconButton';

const StrokeOptionsToggle = (): ReactElement => {
  const strokeOptionsStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.strokeOptionsStylesCollapsed);
  const dispatch = useDispatch();

  const handleOptionsClick = () => {
    if (strokeOptionsStylesCollapsed) {
      dispatch(expandStrokeOptionsStyles());
    } else {
      dispatch(collapseStrokeOptionsStyles());
    }
  }

  return (
    <ToggleIconButton
      value={strokeOptionsStylesCollapsed}
      type='checkbox'
      onChange={handleOptionsClick}
      iconName='more'
      checked={strokeOptionsStylesCollapsed}
      label='stroke options'
      size='small' />
  );
}

export default StrokeOptionsToggle;