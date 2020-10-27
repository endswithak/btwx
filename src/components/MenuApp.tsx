import React, { ReactElement } from 'react';
import MenuAppTheme from './MenuAppTheme';
import MenuAppReload from './MenuAppReload';

const MenuApp = (): ReactElement => (
  <>
    <MenuAppTheme />
    <MenuAppReload />
  </>
);

export default MenuApp;