import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ViewSettingsTypes } from '../store/actionTypes/viewSettings';
import { enableDarkTheme } from '../store/actions/viewSettings';
import { THEME_DARK_BACKGROUND_MIN } from '../constants';

export const MENU_ITEM_ID = 'appThemeDark';

interface MenuAppThemeDarkProps {
  checked?: boolean;
  enableDarkTheme?(): ViewSettingsTypes;
}

const MenuAppThemeDark = (props: MenuAppThemeDarkProps): ReactElement => {
  const { checked, enableDarkTheme } = props;

  useEffect(() => {
    const electronMenuItem = remote.Menu.getApplicationMenu().getMenuItemById(MENU_ITEM_ID);
    electronMenuItem.enabled = true;
    electronMenuItem.checked = checked;
  }, [checked]);

  useEffect(() => {
    (window as any)[MENU_ITEM_ID] = (updateOtherWindows?: boolean): void => {
      enableDarkTheme();
      if (updateOtherWindows) {
        const browserWindowId = remote.getCurrentWindow().id;
        const allWindows = remote.BrowserWindow.getAllWindows();
        allWindows.forEach((window) => {
          if (window.id !== browserWindowId) {
            window.webContents.executeJavaScript(`${MENU_ITEM_ID}(false)`);
          }
          window.setBackgroundColor(THEME_DARK_BACKGROUND_MIN);
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
  const checked = viewSettings.theme === 'dark';
  return { checked };
};

export default connect(
  mapStateToProps,
  { enableDarkTheme }
)(MenuAppThemeDark);