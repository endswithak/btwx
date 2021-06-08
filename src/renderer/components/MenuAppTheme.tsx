import React, { ReactElement, useEffect, useState } from 'react';
import MenuAppThemeLight from './MenuAppThemeLight';
import MenuAppThemeDark from './MenuAppThemeDark';

interface MenuAppThemeProps {
  setTheme(theme: any): void;
}

const MenuAppTheme = (props: MenuAppThemeProps): ReactElement => {
  const { setTheme } = props;
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
        setLight={setLight} />
      <MenuAppThemeDark
        setDark={setDark} />
    </>
  )
};

export default MenuAppTheme;