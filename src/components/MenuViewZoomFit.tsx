import React, { ReactElement } from 'react';
import MenuViewZoomFitCanvas from './MenuViewZoomFitCanvas';
import MenuViewZoomFitSelected from './MenuViewZoomFitSelected';
import MenuViewZoomFitArtboard from './MenuViewZoomFitArtboard';

const MenuViewZoomFit = (): ReactElement => (
  <>
    <MenuViewZoomFitCanvas />
    <MenuViewZoomFitSelected />
    <MenuViewZoomFitArtboard />
  </>
);

export default MenuViewZoomFit;