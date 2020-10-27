import React, { ReactElement } from 'react';
import MenuAppThemeLight from './MenuAppThemeLight';
import MenuAppThemeDark from './MenuAppThemeDark';

const MenuAppTheme = (): ReactElement => (
  <>
    <MenuAppThemeLight />
    <MenuAppThemeDark />
  </>
);

export default MenuAppTheme;