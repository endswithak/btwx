import React, { ReactElement } from 'react';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import StrokeDashOffsetInput from './StrokeDashOffsetInput';
import StrokeDashInput from './StrokeDashInput';
import StrokeGapInput from './StrokeGapInput';
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
            <StrokeDashInput />
          </SidebarSectionColumn>
          <SidebarSectionColumn width='50%'>
            <StrokeGapInput />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default StrokeParamsInput;