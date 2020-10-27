import React, { ReactElement } from 'react';
import MenuArrangeDistributeHorizontally from './MenuArrangeDistributeHorizontally';
import MenuArrangeDistributeVertically from './MenuArrangeDistributeVertically';

const MenuArrangeDistribute = (): ReactElement => (
  <>
    <MenuArrangeDistributeHorizontally />
    <MenuArrangeDistributeVertically />
  </>
);

export default MenuArrangeDistribute;