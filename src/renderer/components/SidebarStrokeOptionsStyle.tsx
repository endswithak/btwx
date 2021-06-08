import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import StrokeCapInput from './StrokeCapInput';
import StrokeJoinInput from './StrokeJoinInput';

const SidebarStrokeOptionStyles = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width='50%'>
        <StrokeCapInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='50%'>
        <StrokeJoinInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarStrokeOptionStyles;