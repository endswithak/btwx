import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandScrollStyles, collapseScrollStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import ScrollToggle from './ScrollToggle';

const SidebarScrollStyles = (): ReactElement => {
  const validScrollSelection = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Group'));
  const fillStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.fillStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (fillStylesCollapsed) {
      dispatch(expandScrollStyles());
    } else {
      dispatch(collapseScrollStyles());
    }
  }

  return (
    validScrollSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={fillStylesCollapsed}
        header='scroll'
        actions={[
          <ScrollToggle key='scrollToggle' />
        ]}>
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarScrollStyles;