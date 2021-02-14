import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import MenuAppThemeLight from './MenuAppThemeLight';
import MenuAppThemeDark from './MenuAppThemeDark';

interface MenuAppThemeProps {
  setTheme(theme: any): void;
}

const MenuAppTheme = (props: MenuAppThemeProps): ReactElement => {
  const { setTheme } = props;
  const [menuItem, setMenuItem] = useState({
    label: 'Theme'
  });
  const [light, setLight] = useState(undefined);
  const [dark, setDark] = useState(undefined);

  useEffect(() => {
    if (light && dark) {
      setTheme({
        ...menuItem,
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

// import React, { ReactElement } from 'react';
// import MenuAppThemeLight from './MenuAppThemeLight';
// import MenuAppThemeDark from './MenuAppThemeDark';

// const MenuAppTheme = (): ReactElement => (
//   <>
//     <MenuAppThemeLight />
//     <MenuAppThemeDark />
//   </>
// );

// export default MenuAppTheme;