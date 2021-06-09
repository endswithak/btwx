import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Topbar from './Topbar';
import EaseEditorWrap from './EaseEditorWrap';
import ArtboardPresetEditorWrap from './ArtboardPresetEditorWrap';
import SessionImages from './SessionImages';
import Titlebar from './Titlebar';
import AutoSaver from './AutoSaver';
import Touchbar from './Touchbar';
import Main from './Main';
import KeyBindings from './KeyBindings';

const App = (): ReactElement => {
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const platform = useSelector((state: RootState) => state.session.platform);

  return (
    <div
      id='app'
      className={`c-app theme--${theme}${
        `${' '}os--${platform === 'darwin' ? 'mac' : 'windows'}`
      }`}>
      {/* flex items */}
      <Titlebar />
      <Topbar />
      <Main />
      {/* abs elements */}
      <EaseEditorWrap />
      <ArtboardPresetEditorWrap />
      <SessionImages />
      <AutoSaver />
      <Touchbar />
      <KeyBindings />
    </div>
  );
}

export default App;