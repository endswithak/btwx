import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarBlendModeStyles from './SidebarBlendModeStyles';

const SidebarContextStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <SidebarSectionWrap>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionHead text={'appearance'} />
        </SidebarSectionRow>
        <SidebarSectionRow alignItems={'center'}>
          <SidebarSectionColumn width={'25%'}>
            <SidebarSectionLabel text={'Opacity'} />
          </SidebarSectionColumn>
          <SidebarSectionColumn width={'75%'}>
            <SidebarBlendModeStyles />
          </SidebarSectionColumn>
        </SidebarSectionRow>
        <SidebarSectionRow>
          <SidebarOpacityStyles />
        </SidebarSectionRow>
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default SidebarContextStyles;