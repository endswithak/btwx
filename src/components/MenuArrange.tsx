import React, { ReactElement } from 'react';
import MenuArrangeBringForward from './MenuArrangeBringForward';
import MenuArrangeBringToFront from './MenuArrangeBringToFront';
import MenuArrangeSendBackward from './MenuArrangeSendBackward';
import MenuArrangeSendToBack from './MenuArrangeSendToBack';
import MenuArrangeAlign from './MenuArrangeAlign';
import MenuArrangeDistribute from './MenuArrangeDistribute';
import MenuArrangeGroup from './MenuArrangeGroup';
import MenuArrangeUngroup from './MenuArrangeUngroup';

const MenuArrange = (): ReactElement => (
  <>
    <MenuArrangeBringForward />
    <MenuArrangeBringToFront />
    <MenuArrangeSendBackward />
    <MenuArrangeSendToBack />
    <MenuArrangeAlign />
    <MenuArrangeDistribute />
    <MenuArrangeGroup />
    <MenuArrangeUngroup />
  </>
);

export default MenuArrange;