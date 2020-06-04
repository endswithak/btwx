import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';

interface SidebarContextStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarContextStyles = (props: SidebarContextStylesProps): ReactElement => {
  const { selectedType, selected } = props;

  return (
    selectedType && selectedType !== 'Artboard'
    ? <SidebarSectionWrap topBorder>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionHead text={'opacity'} />
          </SidebarSectionRow>
        </SidebarSection>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarOpacityStyles />
          </SidebarSectionRow>
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
)(SidebarContextStyles);