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
      <SidebarSectionColumn width='33.33%'>
        <StrokeWidthInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <StrokeDashOffsetInput />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <SidebarSectionRow>
          <SidebarSectionColumn width='50%'>
            <StrokeDashArrayWidthInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='50%'>
            <StrokeDashArrayGapInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default StrokeParamsInput;