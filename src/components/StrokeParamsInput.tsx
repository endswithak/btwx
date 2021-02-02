import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import StrokeDashOffsetInput from './StrokeDashOffsetInput';
import StrokeDashArrayWidthInput from './StrokeDashArrayWidthInput';
import StrokeDashArrayGapInput from './StrokeDashArrayGapInput';
import StrokeWidthInput from './StrokeWidthInput';

const StrokeParamsInput = (): ReactElement => {
  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width='25%'>
        <StrokeWidthInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='25%'>
        <StrokeDashOffsetInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='25%'>
        <StrokeDashArrayWidthInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='25%'>
        <StrokeDashArrayGapInput />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default StrokeParamsInput;