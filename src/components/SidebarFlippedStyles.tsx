import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import VerticalFlipInput from './VerticalFlipInput';
import HorizontalFlipInput from './HorizontalFlipInput';

const SidebarFlippedStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn padded>
        <HorizontalFlipInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn padded>
        <VerticalFlipInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarFlippedStyles;