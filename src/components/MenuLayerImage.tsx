import React, { ReactElement } from 'react';
import MenuLayerImageReplace from './MenuLayerImageReplace';
import MenuLayerImageOriginalDimensions from './MenuLayerImageOriginalDimensions';

const MenuLayerImage = (): ReactElement => (
  <>
    <MenuLayerImageReplace />
    <MenuLayerImageOriginalDimensions />
  </>
);

export default MenuLayerImage;