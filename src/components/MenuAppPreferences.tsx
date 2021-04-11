/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

export const MENU_ITEM_ID = 'appPreferences';

interface MenuAppPreferencesProps {
  setPreferences(item: any): any;
}

const MenuAppPreferences = (props: MenuAppPreferencesProps): ReactElement => {
  const { setPreferences } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Preferences',
    id: MENU_ITEM_ID,
    enabled: true,
    click: {
      id: MENU_ITEM_ID
    }
  });

  useEffect(() => {
    setPreferences(menuItemTemplate);
    (window as any)[MENU_ITEM_ID] = () => {
      ipcRenderer.send('openPreferences');
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuAppPreferences;