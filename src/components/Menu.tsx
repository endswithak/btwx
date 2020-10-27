import React, { ReactElement } from 'react';
import MenuInsert from './MenuInsert';
import MenuApp from './MenuApp';
import MenuFile from './MenuFile';
import MenuEdit from './MenuEdit';
import MenuLayer from './MenuLayer';
import MenuArrange from './MenuArrange';
import MenuView from './MenuView';

const Menu = (): ReactElement => (
  <>
    <MenuApp />
    <MenuFile />
    <MenuEdit />
    <MenuInsert />
    <MenuLayer />
    <MenuArrange />
    <MenuView />
  </>
);

export default Menu;