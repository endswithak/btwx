import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandStrokeStyles, collapseStrokeStyles, expandStrokeOptionsStyles, collapseStrokeOptionsStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import StrokeInput from './StrokeInput';
import SidebarStrokeOptionsStyle from './SidebarStrokeOptionsStyle';
import StrokeOptionsToggle from './StrokeOptionsToggle';
import StrokeToggle from './StrokeToggle';
import StrokeParamsInput from './StrokeParamsInput';

const SidebarStrokeStyles = (): ReactElement => {
  const validFillSelection = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id] && state.layer.present.byId[id].type !== 'Artboard' && state.layer.present.byId[id].type !== 'Group' && state.layer.present.byId[id].type !== 'Image'));
  const strokeStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.strokeStylesCollapsed);
  const strokeOptionsStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.strokeOptionsStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (strokeStylesCollapsed) {
      dispatch(expandStrokeStyles());
    } else {
      dispatch(collapseStrokeStyles());
    }
  }

  const handleOptionsClick = () => {
    if (strokeOptionsStylesCollapsed) {
      dispatch(expandStrokeOptionsStyles());
    } else {
      dispatch(collapseStrokeOptionsStyles());
    }
  }

  return (
    validFillSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={strokeStylesCollapsed}
        header='stroke'
        actions={[
          <StrokeOptionsToggle
            showOptions={strokeOptionsStylesCollapsed}
            onClick={handleOptionsClick}
            key='strokeOptions' />,
          <StrokeToggle key='strokeToggle' />
        ]}>
        <StrokeInput />
        <StrokeParamsInput />
        {
          strokeOptionsStylesCollapsed
          ? <SidebarStrokeOptionsStyle />
          : null
        }
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarStrokeStyles;