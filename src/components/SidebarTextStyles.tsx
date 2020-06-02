import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarTextStyle from './SidebarTextStyle';
import FontFamilySelector from './FontFamilySelector';
import FontWeightSelector from './FontWeightSelector';
import FontSizeInput from './FontSizeInput';
import LeadingInput from './LeadingInput';
import JustificationInput from './JustificationInput';
import { RootState } from '../store/reducers';

interface SidebarTextStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarTextStyles = (props: SidebarTextStylesProps): ReactElement => {
  const { selected, selectedType } = props;
  return (
    selected.length === 1 && selectedType === 'Text'
    ? <SidebarSectionWrap topBorder>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionHead text={'Text'} />
          </SidebarSectionRow>
          <SidebarSection>
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
          </SidebarSection>
        </SidebarSection>
      </SidebarSectionWrap>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedType = selected.length > 0 ? layer.present.byId[selected[0]].type : null;
  return { selected, selectedType };
};

export default connect(
  mapStateToProps
)(SidebarTextStyles);