/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLightTheme } from '../store/actions/viewSettings';
import { THEME_LIGHT_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeLight';

interface MenuAppThemeLightProps {
  menu: Electron.Menu;
  setLight(item: any): any;
}

const MenuAppThemeLight = (props: MenuAppThemeLightProps): ReactElement => {
  const { setLight, menu } = props;
  const isChecked = useSelector((state: RootState) => state.viewSettings.theme === 'light');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Light',
    type: 'checkbox',
    checked: isChecked,
    id: MENU_ITEM_ID,
    enabled: true,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
      remote.nativeTheme.themeSource = 'light';
      const currentWindow = remote.getCurrentWindow();
      dispatch(enableLightTheme());
      currentWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
      if (previewWindowId) {
        const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
        previewWindow.webContents.executeJavaScript(`setTheme('light')`);
        previewWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
      }
    }
  });
  const [menuItem, setMenuItem] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setLight(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = isChecked;
    }
  }, [isChecked]);

  return (
    <></>
  );
}

export default MenuAppThemeLight;