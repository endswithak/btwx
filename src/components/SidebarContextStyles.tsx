import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarBlendModeStyles from './SidebarBlendModeStyles';

const SidebarContextStyles = (): ReactElement => {
  return (
    <SidebarSectionWrap>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionHead text={'appearance'} />
        </SidebarSectionRow>
      </SidebarSection>
      <SidebarSection>
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