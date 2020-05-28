import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarFillStyle from './SidebarFillStyle';
import { RootState } from '../store/reducers';

interface SidebarFillStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarFillStyles = (props: SidebarFillStylesProps): ReactElement => {
  const { selected, selectedType } = props;
  return (
    <SidebarSectionWrap>
      {
        selected.length === 1 && selectedType === 'Shape'
        ? <SidebarSection>
            <SidebarSectionRow>
              <SidebarSectionHead text={'fill'} />
            </SidebarSectionRow>
            <SidebarSection>
              <SidebarFillStyle />
            </SidebarSection>
          </SidebarSection>
        : null
      }
    </SidebarSectionWrap>
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
)(SidebarFillStyles);