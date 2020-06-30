import React, { ReactElement } from 'react';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';

const SidebarContextStyles = (): ReactElement => (
  <SidebarSectionWrap bottomBorder whiteSpace>
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
)

export default SidebarContextStyles;