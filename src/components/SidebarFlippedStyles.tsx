import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import XFlipInput from './XFlipInput';
import YFlipInput from './YFlipInput';

const SidebarFlippedStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <YFlipInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <XFlipInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarFlippedStyles;