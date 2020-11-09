import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { enableDarkTheme } from '../store/actions/viewSettings';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeDark';

interface MenuAppThemeDarkProps {
  checked?: boolean;
  previewWindowId?: number;
  enableDarkTheme?(): ViewSettingsTypes;
}

const MenuAppThemeDark = (props: MenuAppThemeDarkProps): ReactElement => {
  const { checked, enableDarkTheme, previewWindowId } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      const currentWindow = remote.getCurrentWindow();
      enableDarkTheme();
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

const mapStateToProps = (state: RootState): {
  checked: boolean;
  previewWindowId: number;
} => {
  const { viewSettings, preview } = state;
  const checked = viewSettings.theme === 'dark';
  const previewWindowId = preview.windowId;
  return { checked, previewWindowId };
};

export default connect(
  mapStateToProps,
  { enableDarkTheme }
)(MenuAppThemeDark);