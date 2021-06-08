import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandTextStyles, collapseTextStyles } from '../store/actions/rightSidebar';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import FontFamilyInput from './FontFamilyInput';
import FontWeightInput from './FontWeightInput';
import FontSizeInput from './FontSizeInput';
import LeadingInput from './LeadingInput';
import LetterSpacingInput from './LetterSpacingInput';
import FontStyleInput from './FontStyleInput';
import TextTransformInput from './TextTransformInput';
import SidebarCollapseSection from './SidebarCollapseSection';

const SidebarTextStyles = (): ReactElement => {
  const validTextSelection = useSelector((state: RootState) => state.layer.present.selected.every((id: string) => state.layer.present.byId[id].type === 'Text'));
  const textStylesCollapsed = useSelector((state: RootState) => state.rightSidebar.textStylesCollapsed);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (textStylesCollapsed) {
      dispatch(expandTextStyles());
    } else {
      dispatch(collapseTextStyles());
    }
  }

  return (
    validTextSelection
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={textStylesCollapsed}
        header='text'>
        <SidebarSectionRow>
          <SidebarSectionColumn width='100%'>
            <FontFamilyInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <FontWeightInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <FontSizeInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <FontStyleInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <LetterSpacingInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <LeadingInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <TextTransformInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarTextStyles;