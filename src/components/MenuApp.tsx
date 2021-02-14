import { remote } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
import { APP_NAME } from '../constants';
import MenuAppTheme from './MenuAppTheme';

interface MenuAppProps {
  setApp(app: any): void;
}

const MenuApp = (props: MenuAppProps): ReactElement => {
  const { setApp } = props;
  const [menuItem, setMenuItem] = useState({
    label: APP_NAME
  });
  const [theme, setTheme] = useState(undefined);

  useEffect(() => {
    if (theme) {
      setApp({
        ...menuItem,
        submenu: [
          theme,
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
  }, [theme]);

  return (
    <>
      <MenuAppTheme
        setTheme={setTheme} />
      {/* <MenuAppReload
        appMenu={menuItem} /> */}
    </>
  )
};

export default MenuApp;

// import React, { ReactElement } from 'react';
// import MenuAppTheme from './MenuAppTheme';
// import MenuAppReload from './MenuAppReload';

// const MenuApp = (): ReactElement => (
//   <>
//     <MenuAppTheme />
//     <MenuAppReload />
//   </>
// );

// export default MenuApp;