import React, { ReactElement } from 'react';
import MenuLayerStyleFill from './MenuLayerStyleFill';
import MenuLayerStyleStroke from './MenuLayerStyleStroke';
import MenuLayerStyleShadow from './MenuLayerStyleShadow';

const MenuLayerStyle = (): ReactElement => (
  <>
    <MenuLayerStyleFill />
    <MenuLayerStyleStroke />
    <MenuLayerStyleShadow />
  </>
);

export default MenuLayerStyle;