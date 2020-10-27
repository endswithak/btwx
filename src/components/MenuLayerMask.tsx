import React, { ReactElement } from 'react';
import MenuLayerMaskUseAsMask from './MenuLayerMaskUseAsMask';
import MenuLayerMaskIgnoreUnderlyingMask from './MenuLayerMaskIgnoreUnderlyingMask';

const MenuLayerMask = (): ReactElement => (
  <>
    <MenuLayerMaskUseAsMask />
    <MenuLayerMaskIgnoreUnderlyingMask />
  </>
);

export default MenuLayerMask;