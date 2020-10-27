import React, { ReactElement, useEffect, useState, useContext } from 'react';
import { Titlebar as ElectronTitlebar, Color } from 'custom-electron-titlebar';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface TitlebarProps {
  documentName?: string;
  themeName?: string;
}

const Titlebar = (props: TitlebarProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { documentName, themeName } = props;
  const [titlebar, setTitlebar] = useState(null);

  useEffect(() => {
    setTitlebar(new ElectronTitlebar({
      backgroundColor: Color.fromHex(theme.name === 'dark' ? theme.background.z1 : theme.background.z2)
    }));
  }, []);

  useEffect(() => {
    if (titlebar && documentName) {
      titlebar.updateTitle(documentName);
    }
  }, [documentName]);

  useEffect(() => {
    if (titlebar) {
      titlebar.updateBackground(Color.fromHex(themeName === 'dark' ? theme.background.z1 : theme.background.z2));
    }
  }, [themeName]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  documentName: string;
  themeName: string;
} => {
  const { documentSettings, viewSettings } = state;
  const documentName = documentSettings.name;
  const themeName = viewSettings.theme;
  return { documentName, themeName };
};

export default connect(
  mapStateToProps
)(Titlebar);