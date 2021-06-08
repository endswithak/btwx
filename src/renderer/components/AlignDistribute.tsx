import React, { ReactElement } from 'react';
import SidebarSectionWrap from './SidebarSectionWrap';
import DistributeHorizontallyToggle from './DistributeHorizontallyToggle';
import DistributeVerticallyToggle from './DistributeVerticallyToggle';
import ButtonGroup from './ButtonGroup';
import AlignLeftToggle from './AlignLeftToggle';
import AlignRightToggle from './AlignRightToggle';
import AlignTopToggle from './AlignTopToggle';
import AlignBottomToggle from './AlignBottomToggle';
import AlignCenterToggle from './AlignCenterToggle';
import AlignMiddleToggle from './AlignMiddleToggle';

const AlignDistribute = (): ReactElement => {
  return (
    <SidebarSectionWrap bottomBorder>
      <ButtonGroup block>
        <DistributeHorizontallyToggle />
        <DistributeVerticallyToggle />
        <AlignLeftToggle />
        <AlignCenterToggle />
        <AlignRightToggle />
        <AlignTopToggle />
        <AlignMiddleToggle />
        <AlignBottomToggle />
      </ButtonGroup>
    </SidebarSectionWrap>
  );
}

export default AlignDistribute;