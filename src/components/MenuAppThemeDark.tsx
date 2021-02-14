/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableDarkTheme } from '../store/actions/viewSettings';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';
import MenuItem, { MenuItemProps } from './MenuItem';

export const MENU_ITEM_ID = 'appThemeDark';

interface MenuAppThemeDarkProps {
  setDark(item: any): any;
}

const MenuAppThemeDark = (props: MenuAppThemeDarkProps): ReactElement => {
  const { setDark } = props;
  const checked = useSelector((state: RootState) => state.viewSettings.theme === 'dark');
  const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
  const dispatch = useDispatch();

  const [menuItem, setMenuItem] = useState({
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
    const appMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    if (appMenuItem) {
      appMenuItem.checked = checked;
    }
  }, [checked]);

  useEffect(() => {
    setDark(menuItem);
  }, [menuItem]);

  return (
    <></>
  );
}

export default MenuAppThemeDark;

// import React, { ReactElement, useEffect } from 'react';
// import { remote } from 'electron';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { enableDarkTheme } from '../store/actions/viewSettings';
// import { THEME_DARK_BACKGROUND_MIN } from '../constants';
// import { getAllDocumentWindows } from '../utils';
// import MenuItem, { MenuItemProps } from './MenuItem';

// export const MENU_ITEM_ID = 'appThemeDark';

// const MenuAppThemeDark = (props: MenuItemProps): ReactElement => {
//   const { menuItem } = props;
//   const checked = useSelector((state: RootState) => state.viewSettings.theme === 'dark');
//   const previewWindowId = useSelector((state: RootState) => state.preview.windowId);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     menuItem.enabled = true;
//     menuItem.checked = checked;
//   }, [checked]);

//   useEffect(() => {
//     (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
//       remote.nativeTheme.themeSource = 'dark';
//       const currentWindow = remote.getCurrentWindow();
//       dispatch(enableDarkTheme());
//       currentWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
//       if (previewWindowId) {
//         const previewWindow = remote.BrowserWindow.fromId(previewWindowId);
//         previewWindow.webContents.executeJavaScript(`setTheme('dark')`);
//         previewWindow.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
//       }
//       if (updateOtherWindows) {
//         getAllDocumentWindows(true).then((documentWindows) => {
//           documentWindows.forEach((window) => {
//             if (window.id !== currentWindow.id) {
//               window.webContents.executeJavaScript(`${MENU_ITEM_ID}(false)`);
//             }
//           });
//         });
//       }
//     };
//   }, [previewWindowId]);

//   return (
//     <></>
//   );
// }

// export default MenuItem(
//   MenuAppThemeDark,
//   MENU_ITEM_ID
// );