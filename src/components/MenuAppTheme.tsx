import React, { ReactElement, useEffect, useState } from 'react';
import MenuAppThemeLight from './MenuAppThemeLight';
import MenuAppThemeDark from './MenuAppThemeDark';

interface MenuAppThemeProps {
  menu: Electron.Menu;
  setTheme(theme: any): void;
}

const MenuAppTheme = (props: MenuAppThemeProps): ReactElement => {
  const { setTheme, menu } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Theme'
  });
  const [light, setLight] = useState(undefined);
  const [dark, setDark] = useState(undefined);

  useEffect(() => {
    if (light && dark) {
      setTheme({
        ...menuItemTemplate,
        submenu: [light, dark]
      });
    }
  }, [light, dark]);

  return (
    <>
      <MenuAppThemeLight
        menu={menu}
        setLight={setLight} />
      <MenuAppThemeDark
        menu={menu}
        setDark={setDark} />
    </>
  )
};

export default MenuAppTheme;