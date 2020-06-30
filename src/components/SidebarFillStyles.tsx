import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionHead from './SidebarSectionHead';
import FillColorInput from './FillColorInput';
import FillInput from './FillInput';
import FillToggle from './FillToggle';
import { RootState } from '../store/reducers';

interface SidebarFillStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarFillStyles = (props: SidebarFillStylesProps): ReactElement => {
  const { selected, selectedType } = props;
  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text')
    ? <SidebarSectionWrap bottomBorder whiteSpace>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'fill'} />
              </SidebarSectionRow>
            </SidebarSectionColumn>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow justifyContent='flex-end'>
                <FillToggle />
              </SidebarSectionRow>
            </SidebarSectionColumn>
          </SidebarSectionRow>
          <SidebarSection>
            <FillInput />
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
)(SidebarFillStyles);