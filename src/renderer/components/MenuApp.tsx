import { useSelector } from 'react-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { RootState } from '../store/reducers';
import { APP_NAME } from '../constants';
import MenuAppPreferences from './MenuAppPreferences';

interface MenuAppProps {
  setApp(app: any): void;
}

const MenuApp = (props: MenuAppProps): ReactElement => {
  const { setApp } = props;
  const isMac = useSelector((state: RootState) => state.session.platform === 'darwin');
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: APP_NAME
  });
  const [preferences, setPreferences] = useState(undefined);

  useEffect(() => {
    if (preferences) {
      setApp({
        ...menuItemTemplate,
        submenu: [
          ...isMac ? [preferences, { type: 'separator' }] : [],
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
  }, [preferences]);

  return (
    <>
      <MenuAppPreferences
        setPreferences={setPreferences} />
    </>
  )
};

export default MenuApp;