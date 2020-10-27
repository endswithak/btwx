import React, { ReactElement } from 'react';
import MenuArrangeAlignLeft from './MenuArrangeAlignLeft';
import MenuArrangeAlignHorizontally from './MenuArrangeAlignHorizontally';
import MenuArrangeAlignRight from './MenuArrangeAlignRight';
import MenuArrangeAlignTop from './MenuArrangeAlignTop';
import MenuArrangeAlignVertically from './MenuArrangeAlignVertically';
import MenuArrangeAlignBottom from './MenuArrangeAlignBottom';

const MenuArrangeAlign = (): ReactElement => (
  <>
    <MenuArrangeAlignLeft />
    <MenuArrangeAlignHorizontally />
    <MenuArrangeAlignRight />
    <MenuArrangeAlignTop />
    <MenuArrangeAlignVertically />
    <MenuArrangeAlignBottom />
  </>
);

export default MenuArrangeAlign;