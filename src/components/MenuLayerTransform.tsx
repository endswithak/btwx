import React, { ReactElement } from 'react';
import MenuLayerTransformFlipHorizontally from './MenuLayerTransformFlipHorizontally';
import MenuLayerTransformFlipVertically from './MenuLayerTransformFlipVertically';

const MenuLayerTransform = (): ReactElement => (
  <>
    <MenuLayerTransformFlipHorizontally />
    <MenuLayerTransformFlipVertically />
  </>
);

export default MenuLayerTransform;