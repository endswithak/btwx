import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import HeightInput from './HeightInput';
import WidthInput from './WidthInput';

const SidebarSizeStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <WidthInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <HeightInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarSizeStyles;