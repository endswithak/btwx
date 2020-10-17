import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setMenuItems } from '../utils';

interface MenuAppProps {
  theme?: em.ThemeName;
}

const MenuApp = (props: MenuAppProps): ReactElement => {
  const { theme } = props;

  useEffect(() => {
    setMenuItems({
      appThemeDark: {
        id: 'appThemeDark',
        enabled: true,
        checked: theme === 'dark'
      },
      appThemeLight: {
        id: 'appThemeLight',
        enabled: true,
        checked: theme === 'light'
      },
      appReload: {
        id: 'appReload',
        enabled: true
      }
    });
  }, [theme]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  theme: em.ThemeName;
} => {
  const { viewSettings } = state;
  const theme = viewSettings.theme;
  return { theme };
};

export default connect(
  mapStateToProps
)(MenuApp);