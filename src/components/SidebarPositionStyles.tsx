import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import XInput from './XInput';
import YInput from './YInput';

const SidebarPositionStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <XInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <YInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarPositionStyles;