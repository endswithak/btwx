import React, { ReactElement } from 'react';
import MenuViewZoomIn from './MenuViewZoomIn';
import MenuViewZoomOut from './MenuViewZoomOut';
import MenuViewZoomFit from './MenuViewZoomFit';
import MenuViewCenterSelected from './MenuViewCenterSelected';
import MenuViewShowLayers from './MenuViewShowLayers';
import MenuViewShowStyles from './MenuViewShowStyles';
import MenuViewShowEvents from './MenuViewShowEvents';

const MenuView = (): ReactElement => (
  <>
    <MenuViewZoomIn />
    <MenuViewZoomOut />
    <MenuViewZoomFit />
    <MenuViewCenterSelected />
    <MenuViewShowLayers />
    <MenuViewShowStyles />
    <MenuViewShowEvents />
  </>
);

export default MenuView;