import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { expandTextStyles, collapseTextStyles } from '../store/actions/rightSidebar';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import FontFamilySelector from './FontFamilySelector';
import FontWeightInput from './FontWeightInput';
import ObliqueInput from './ObliqueInput';
import FontSizeInput from './FontSizeInput';
import LeadingInput from './LeadingInput';
import JustificationInput from './JustificationInput';
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
            <FontFamilySelector />
          </SidebarSectionColumn>
          {/* <SidebarSectionColumn width='33.33%'>
            <FontWeightSelector />
          </SidebarSectionColumn> */}
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarSectionColumn width='33.33%'>
            <FontSizeInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <LeadingInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <JustificationInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <FontWeightInput />
        <ObliqueInput />
      </SidebarCollapseSection>
    : null
  );
}

export default SidebarTextStyles;