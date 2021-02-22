/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { ipcRenderer, remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { openPreferences } from '../store/actions/preferences';

export const MENU_ITEM_ID = 'appPreferences';

interface MenuAppPreferencesProps {
  menu: Electron.Menu;
  setPreferences(item: any): any;
}

const MenuAppPreferences = (props: MenuAppPreferencesProps): ReactElement => {
  const { setPreferences, menu } = props;
  const isOpen = useSelector((state: RootState) => state.preferences.isOpen);
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Preferences',
    id: MENU_ITEM_ID,
    enabled: true,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
      if (isOpen) {

      } else {
        ipcRenderer.send('openPreview', JSON.stringify({windowSize, documentWindowId}));
        dispatch(openPreferences());
      }
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setPreferences(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  return (
    <></>
  );
}

export default MenuAppPreferences;