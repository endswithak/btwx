import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandFillStyles, collapseFillStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import FillInput from './FillInput';
import FillToggle from './FillToggle';
import FillRuleToggle from './FillRuleToggle';

const SidebarFillStyles = (): ReactElement => {
  const validFillSelection = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id] && state.layer.present.byId[id].type !== 'Group' && state.layer.present.byId[id].type !== 'Image' && !(state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line')));
  const fillStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.fillStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (fillStylesCollapsed) {
      dispatch(expandFillStyles());
    } else {
      dispatch(collapseFillStyles());
    }
  }

  return (
    validFillSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={fillStylesCollapsed}
        header='fill'
        actions={[
          <FillRuleToggle
            key='fillRule' />,
          <FillToggle
            key='fillToggle' />
        ]}>
        <FillInput />
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarFillStyles;