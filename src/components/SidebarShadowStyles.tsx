import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarShadowStyle from './ShadowColorInput';
import ShadowToggle from './ShadowToggle';
import ShadowXInput from './ShadowXInput';
import ShadowYInput from './ShadowYInput';
import ShadowBlurInput from './ShadowBlurInput';
import { RootState } from '../store/reducers';

interface SidebarShadowStylesProps {
  selected?: string[];
  selectedType?: string;
}

const SidebarShadowStyles = (props: SidebarShadowStylesProps): ReactElement => {
  const { selected, selectedType } = props;

  return (
    selected.length === 1 && (selectedType === 'Shape' || selectedType === 'Text')
    ? <SidebarSectionWrap bottomBorder whiteSpace>
        <SidebarSection>
          <SidebarSectionRow>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow>
                <SidebarSectionHead text={'shadow'} />
              </SidebarSectionRow>
            </SidebarSectionColumn>
            <SidebarSectionColumn width='50%'>
              <SidebarSectionRow justifyContent='flex-end'>
                <ShadowToggle />
              </SidebarSectionRow>
            </SidebarSectionColumn>
          </SidebarSectionRow>
          <SidebarSection>
            <SidebarSectionRow>
              <SidebarShadowStyle />
            </SidebarSectionRow>
            <SidebarSectionRow>
              <SidebarSectionColumn width='33.33%'>
                <ShadowXInput />
              </SidebarSectionColumn>
              <SidebarSectionColumn width='33.33%'>
                <ShadowYInput />
              </SidebarSectionColumn>
              <SidebarSectionColumn width='33.33%'>
                <ShadowBlurInput />
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
)(SidebarShadowStyles);