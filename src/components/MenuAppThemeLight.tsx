import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { enableLightTheme } from '../store/actions/viewSettings';
import { THEME_LIGHT_BACKGROUND_MIN } from '../constants';
import { getAllDocumentWindows } from '../utils';

export const MENU_ITEM_ID = 'appThemeLight';

interface MenuAppThemeLightProps {
  checked?: boolean;
  previewWindowId?: number;
  enableLightTheme?(): ViewSettingsTypes;
}

const MenuAppThemeLight = (props: MenuAppThemeLightProps): ReactElement => {
  const { checked, enableLightTheme, previewWindowId } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      const currentWindow = remote.getCurrentWindow();
      enableLightTheme();
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

const mapStateToProps = (state: RootState): {
  checked: boolean;
  previewWindowId: number;
} => {
  const { viewSettings, preview } = state;
  const checked = viewSettings.theme === 'light';
  const previewWindowId = preview.windowId;
  return { checked, previewWindowId };
};

export default connect(
  mapStateToProps,
  { enableLightTheme }
)(MenuAppThemeLight);