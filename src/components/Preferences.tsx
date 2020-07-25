import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { enableDarkTheme, enableLightTheme } from '../store/actions/theme';
import { ipcRenderer } from 'electron';

interface PreferencesProps {
  themeName: em.ThemeName;
  enableDarkTheme(): void;
  enableLightTheme(): void;
}

const Preferences = (props: PreferencesProps): ReactElement => {
  const preferences = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { themeName, enableDarkTheme, enableLightTheme } = props;

  const handleClick = () => {
    switch(themeName) {
      case 'dark':
        enableLightTheme();
        ipcRenderer.send('updateTheme');
        break;
      case 'light':
        enableDarkTheme();
        ipcRenderer.send('updateTheme');
        break;
    }
  }

  return (
    <div
      className='c-app'
      ref={preferences}
      style={{
        background: theme.background.z0
      }}>
      <div className='c-app__canvas'>
        <button onClick={handleClick}>{themeName}</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { theme } = state;
  return { themeName: theme.theme };
};

export default connect(
  mapStateToProps,
  { enableDarkTheme, enableLightTheme }
)(Preferences);