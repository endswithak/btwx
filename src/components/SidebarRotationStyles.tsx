import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import RotationInput from './RotationInput';

const SidebarRotationStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <RotationInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarRotationStyles;