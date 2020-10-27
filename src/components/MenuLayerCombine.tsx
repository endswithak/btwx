import React, { ReactElement } from 'react';
import MenuLayerCombineUnion from './MenuLayerCombineUnion';
import MenuLayerCombineSubtract from './MenuLayerCombineSubtract';
import MenuLayerCombineIntersect from './MenuLayerCombineIntersect';
import MenuLayerCombineDifference from './MenuLayerCombineDifference';

const MenuLayerCombine = (): ReactElement => (
  <>
    <MenuLayerCombineUnion />
    <MenuLayerCombineSubtract />
    <MenuLayerCombineIntersect />
    <MenuLayerCombineDifference />
  </>
);

export default MenuLayerCombine;