import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import FontFamilySelector from './FontFamilySelector';
import FontWeightSelector from './FontWeightSelector';
import FontSizeInput from './FontSizeInput';
import LeadingInput from './LeadingInput';
import JustificationInput from './JustificationInput';
import SidebarCollapseSection from './SidebarCollapseSection';
import { RightSidebarTypes } from '../store/actionTypes/rightSidebar';
import { expandTextStyles, collapseTextStyles } from '../store/actions/rightSidebar';

interface SidebarTextStylesProps {
  selected?: string[];
  selectedType?: string;
  textStylesCollapsed?: boolean;
  expandTextStyles?(): RightSidebarTypes;
  collapseTextStyles?(): RightSidebarTypes;
}

const SidebarTextStyles = (props: SidebarTextStylesProps): ReactElement => {
  const { selected, selectedType, textStylesCollapsed, expandTextStyles, collapseTextStyles } = props;

  const handleClick = () => {
    if (textStylesCollapsed) {
      expandTextStyles();
    } else {
      collapseTextStyles();
    }
  }

  return (
    selected.length === 1 && selectedType === 'Text'
    ? <SidebarCollapseSection
        onClick={handleClick}
        collapsed={textStylesCollapsed}
        header='text'>
        <SidebarSectionRow>
          <SidebarSectionColumn width='66.66%'>
            <FontFamilySelector />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='33.33%'>
            <FontWeightSelector />
          </SidebarSectionColumn>
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
      </SidebarCollapseSection>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, rightSidebar } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  const textStylesCollapsed = rightSidebar.textStylesCollapsed;
  return { selected, selectedType, textStylesCollapsed };
};

export default connect(
  mapStateToProps,
  { expandTextStyles, collapseTextStyles }
)(SidebarTextStyles);