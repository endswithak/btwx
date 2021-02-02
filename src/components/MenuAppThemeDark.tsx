import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableDarkTheme } from '../store/actions/viewSettings';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'appThemeDark';

const MenuAppThemeDark = (props: MenuItemProps): ReactElement => {
  const { menuItem } = props;
  const checked = useSelector((state: RootState) => state.viewSettings.theme === 'dark');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  useEffect(() => {
    menuItem.enabled = true;
    menuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      remote.nativeTheme.themeSource = 'dark';
      const currentWindow = remote.getCurrentWindow();
      dispatch(enableDarkTheme());
      currentWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
      if (previewWindowId) {
        const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
        previewWindow.webContents.executeJavaScript(`setTheme('dark')`);
        previewWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
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

export default MenuItem(
  MenuAppThemeDark,
  MENU_ITEM_ID
);