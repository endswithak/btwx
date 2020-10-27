import React, { ReactElement } from 'react';
import MenuLayerStyle from './MenuLayerStyle';
import MenuLayerTransform from './MenuLayerTransform';
import MenuLayerCombine from './MenuLayerCombine';
import MenuLayerImage from './MenuLayerImage';
import MenuLayerMask from './MenuLayerMask';

const MenuLayer = (): ReactElement => (
  <>
    <MenuLayerStyle />
    <MenuLayerTransform />
    <MenuLayerCombine />
    <MenuLayerImage />
    <MenuLayerMask />
  </>
);

export default MenuLayer;