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
import ScrollDirectionInput from './ScrollDirectionInput';
import ScrollResizeInput from './ScrollResizeInput';
import HorizontalScrollInput from './HorizontalScrollInput';
import VerticalScrollInput from './VerticalScrollInput';

const SidebarScrollStyles = (): ReactElement => {
  const validScrollSelection = useSelector((state: RootState) => state.layer.present.selected.every((id) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Group'));
  const scrollStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.scrollStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (scrollStylesCollapsed) {
      dispatch(collapseScrollStyles());
    } else {
      dispatch(expandScrollStyles());
    }
  }

  return (
    validScrollSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={scrollStylesCollapsed}
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
            <SidebarSectionLabel text='Direction' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <ScrollDirectionInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <HorizontalScrollInput />
        <VerticalScrollInput />
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