import React, { ReactElement } from 'react';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import DistributeHorizontallyToggle from './DistributeHorizontallyToggle';
import DistributeVerticallyToggle from './DistributeVerticallyToggle';
import AlignLeftToggle from './AlignLeftToggle';
import AlignRightToggle from './AlignRightToggle';
import AlignTopToggle from './AlignTopToggle';
import AlignBottomToggle from './AlignBottomToggle';
import AlignCenterToggle from './AlignCenterToggle';
import AlignMiddleToggle from './AlignMiddleToggle';

const AlignDistribute = (): ReactElement => {
  return (
    <SidebarSectionWrap bottomBorder>
      <SidebarSection>
        <SidebarSectionRow>
          <SidebarSectionColumn>
            <DistributeHorizontallyToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <DistributeVerticallyToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignLeftToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignCenterToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignRightToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignTopToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignMiddleToggle />
          </SidebarSectionColumn>
          <SidebarSectionColumn>
            <AlignBottomToggle />
          </SidebarSectionColumn>
        </SidebarSectionRow>
      </SidebarSection>
    </SidebarSectionWrap>
  );
}

export default AlignDistribute;