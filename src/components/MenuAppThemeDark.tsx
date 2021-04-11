/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeDark';

interface MenuAppThemeDarkProps {
  setDark(item: any): any;
}

const MenuAppThemeDark = (props: MenuAppThemeDarkProps): ReactElement => {
  const { setDark } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const isChecked = useSelector((state: RootState) => state.preferences.theme === 'dark');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Dark',
      type: 'checkbox',
      checked: isChecked,
      id: MENU_ITEM_ID,
      enabled: true,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      // remote.nativeTheme.themeSource = 'dark';
      // const currentWindow = remote.getCurrentWindow();
      // dispatch(enableDarkTheme());
      // currentWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
      // if (previewWindowId) {
      //   const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
      //   previewWindow.webContents.executeJavaScript(`setTheme('dark')`);
      //   previewWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
      // }
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        checked: isChecked
      });
    }
  }, [isChecked]);

  useEffect(() => {
    if (menuItemTemplate) {
      setDark(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuAppThemeDark;