import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { ipcRenderer } from 'electron';

interface PreferencesProps {
  themeName: em.ThemeName;
}

const Preferences = (props: PreferencesProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { themeName } = props;

  const handleClick = () => {
    switch(themeName) {
      case 'dark':
        ipcRenderer.send('updateTheme', 'light');
        break;
      case 'light':
        ipcRenderer.send('updateTheme', 'dark');
        break;
    }
  }

  return (
    <div
      className='c-app'
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
  mapStateToProps
)(Preferences);