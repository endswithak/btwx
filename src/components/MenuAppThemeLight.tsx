/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { THEME_LIGHT_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeLight';

interface MenuAppThemeLightProps {
  setLight(item: any): any;
}

const MenuAppThemeLight = (props: MenuAppThemeLightProps): ReactElement => {
  const { setLight } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const isChecked = useSelector((state: RootState) => state.preferences.theme === 'light');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Light',
      type: 'checkbox',
      checked: isChecked,
      id: MENU_ITEM_ID,
      enabled: true,
      click: {
        id: MENU_ITEM_ID
      }
    });
    (window as any)[MENU_ITEM_ID] = () => {
      // remote.nativeTheme.themeSource = 'light';
      // const currentWindow = remote.getCurrentWindow();
      // dispatch(enableLightTheme());
      // currentWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
      // if (previewWindowId) {
      //   const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
      //   previewWindow.webContents.executeJavaScript(`setTheme('light')`);
      //   previewWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
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
      setLight(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuAppThemeLight;