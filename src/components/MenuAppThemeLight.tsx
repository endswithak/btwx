import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { enableLightTheme } from '../store/actions/viewSettings';
import { THEME_LIGHT_BACKGROUND_MIN } from '../constants';

export const MENU_ITEM_ID = 'appThemeLight';

interface MenuAppThemeLightProps {
  checked?: boolean;
  enableLightTheme?(): ViewSettingsTypes;
}

const MenuAppThemeLight = (props: MenuAppThemeLightProps): ReactElement => {
  const { checked, enableLightTheme } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      enableLightTheme();
      if (updateOtherWindows) {
        const browserWindowId = remote.getCurrentWindow().id;
        const allWindows = remote.BrowserWindow.getAllWindows();
        allWindows.forEach((window) => {
          if (window.id !== browserWindowId) {
            window.webContents.executeJavaScript(`${MENU_ITEM_ID}(false)`);
          }
          window.setBackgroundColor(THEME_LIGHT_BACKGROUND_MIN);
        });
      }
    };
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  checked: boolean;
} => {
  const { viewSettings } = state;
  const checked = viewSettings.theme === 'light';
  return { checked };
};

export default connect(
  mapStateToProps,
  { enableLightTheme }
)(MenuAppThemeLight);