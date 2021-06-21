import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandScrollStyles, collapseScrollStyles } from '../store/actions/rightSidebar';
import SidebarCollapseSection from './SidebarCollapseSection';
import ScrollToggle from './ScrollToggle';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import ScrollOverflowInput from './ScrollOverflowInput';
import ScrollAxisInput from './ScrollAxisInput';
import ScrollResizeInput from './ScrollResizeInput';

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
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Overflow' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <ScrollOverflowInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Axis' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <ScrollAxisInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='100%'>
            <ScrollResizeInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarScrollStyles;