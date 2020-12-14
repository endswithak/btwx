import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableLightTheme } from '../store/actions/viewSettings';
import { THEME_LIGHT_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeLight';

const MenuAppThemeLight = (): ReactElement => {
  const checked = useSelector((state: RootState) => state.viewSettings.theme === 'light');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      const currentWindow = remote.getCurrentWindow();
      dispatch(enableLightTheme());
      currentWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
      if (previewWindowId) {
        const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
        previewWindow.webContents.executeJavaScript(`setTheme('light')`);
        previewWindow.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
      }
      if (updateOtherWindows) {
        getAllDocumentWindows(true).then((documentWindows) => {
          documentWindows.forEach((window) => {
            if (window.id !== currentWindow.id) {
              window.webContents.executeJavaScript(`${MENU_ITEM_ID}(false)`);
            }
          });
        });
      }
    };
  }, [previewWindowId]);

  return (
    <></>
  );
}

export default MenuAppThemeLight;