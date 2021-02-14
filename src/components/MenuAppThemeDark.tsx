/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableDarkTheme } from '../store/actions/viewSettings';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeDark';

interface MenuAppThemeDarkProps {
  menu: Electron.Menu;
  setDark(item: any): any;
}

const MenuAppThemeDark = (props: MenuAppThemeDarkProps): ReactElement => {
  const { setDark, menu } = props;
  const [menuItem, setMenuItem] = useState(undefined);
  const checked = useSelector((state: RootState) => state.viewSettings.theme === 'dark');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  const [menuItemTemplate, setMenuItemTemplate] = useState({
    label: 'Dark',
    type: 'checkbox',
    checked: checked,
    id: MENU_ITEM_ID,
    enabled: true,
    click: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.Event) => {
      remote.nativeTheme.themeSource = 'dark';
      const currentWindow = remote.getCurrentWindow();
      dispatch(enableDarkTheme());
      currentWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
      if (previewWindowId) {
        const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
        previewWindow.webContents.executeJavaScript(`setTheme('dark')`);
        previewWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
      }
    }
  });

  useEffect(() => {
    setDark(menuItemTemplate);
  }, [menuItemTemplate]);

  useEffect(() => {
    if (menu) {
      setMenuItem(menu.getMenuItemById(MENU_ITEM_ID));
    }
  }, [menu]);

  useEffect(() => {
    if (menuItem) {
      menuItem.checked = checked;
    }
  }, [checked]);

  return (
    <></>
  );
}

export default MenuAppThemeDark;