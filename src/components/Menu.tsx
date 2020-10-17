import React, { ReactElement, useEffect } from 'react';
import MenuInsert from './MenuInsert';
import MenuApp from './MenuApp';
import MenuFile from './MenuFile';
import MenuEdit from './MenuEdit';
import MenuViewShow from './MenuViewShow';
import MenuViewZoom from './MenuViewZoom';
import MenuArrangeGroup from './MenuArrangeGroup';
import MenuArrangeAlign from './MenuArrangeAlign';
import MenuArrangeDistribute from './MenuArrangeDistribute';
import MenuLayerCombine from './MenuLayerCombine';
import MenuLayerMask from './MenuLayerMask';
import MenuLayerTransform from './MenuLayerTransform';
import MenuLayerStyle from './MenuLayerStyle';

const Menu = (): ReactElement => {

  return (
    <>
      {/* App */}
      <MenuApp />
      {/* File */}
      <MenuFile />
      {/* Edit */}
      <MenuEdit />
      {/* View */}
      <MenuViewShow />
      <MenuViewZoom />
      {/* Insert */}
      <MenuInsert />
      {/* Arrange */}
      <MenuArrangeGroup />
      <MenuArrangeAlign />
      <MenuArrangeDistribute />
      {/* Layer */}
      <MenuLayerCombine />
      <MenuLayerMask />
      <MenuLayerTransform />
      <MenuLayerStyle />
    </>
  );
}

export default Menu;