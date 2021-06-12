import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandAlignmentStyles, collapseAlignmentStyles } from '../store/actions/rightSidebar';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import JustificationInput from './JustificationInput';
import VerticalAlignmentInput from './VerticalAlignmentInput';
import TextResizeInput from './TextResizeInput';
import PointXInput from './PointXInput';
import PointYInput from './PointYInput';
import SidebarCollapseSection from './SidebarCollapseSection';
import SidebarSectionLabel from './SidebarSectionLabel';

const SidebarAlignmentStyles = (): ReactElement => {
  const validTextSelection = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id] && state.layer.present.byId[id].type === 'Text'));
  const alignmentStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.alignmentStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (alignmentStylesCollapsed) {
      dispatch(expandAlignmentStyles());
    } else {
      dispatch(collapseAlignmentStyles());
    }
  }

  return (
    validTextSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={alignmentStylesCollapsed}
        header='Alignment'>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Horizontal' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <JustificationInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Resize' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <TextResizeInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Vertical' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='66.66%'>
            <VerticalAlignmentInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <SidebarSectionLabel text='Point' />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <PointXInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <PointYInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarAlignmentStyles;