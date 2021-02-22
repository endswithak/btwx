import React, { ReactElement, useEffect, useState } from 'react';
import { APP_NAME } from '../constants';
import MenuAppTheme from './MenuAppTheme';
import MenuAppPreferences from './MenuAppPreferences';

interface MenuAppProps {
  menu: Electron.Menu;
  setApp(app: any): void;
}

const MenuApp = (props: MenuAppProps): ReactElement => {
  const { setApp, menu } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: APP_NAME
  });
  const [theme, setTheme] = useState(undefined);
  const [preferences, setPreferences] = useState(undefined);

  useEffect(() => {
    if (theme && preferences) {
      setApp({
        ...menuItemTemplate,
        submenu: [
          theme,
          { type: 'separator' },
          preferences,
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
    }
  }, [theme, preferences]);

  return (
    <>
      <MenuAppTheme
        menu={menu}
        setTheme={setTheme} />
      <MenuAppPreferences
        menu={menu}
        setPreferences={setPreferences} />
    </>
  )
};

export default MenuApp;