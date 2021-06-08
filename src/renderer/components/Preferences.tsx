import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Titlebar from './Titlebar';
import PreferencesTabs from './PreferencesAside';
import PreferencesGeneral from './PreferencesGeneral';
import PreferencesBindings from './PreferencesBindings';
import PreferencesTopbar from './PreferencesTopbar';

const Preferences = (): ReactElement => {
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const platform = useSelector((state: RootState) => state.session.platform);
  const [tab, setTab] = useState<Btwx.PreferencesTab>('general');

  return (
    <div className={`c-preferences theme--${theme} ${`os--${platform === 'darwin' ? 'mac' : 'windows'}`}`}>
      <PreferencesTabs
        tab={tab}
        setTab={setTab} />
      <div className='c-preferences__main'>
        <Titlebar />
        <PreferencesTopbar
          tab={tab} />
        <div className='c-preferences__scroll'>
          {
            (() => {
              switch(tab) {
                case 'general':
                  return <PreferencesGeneral />;
                case 'bindings':
                  return <PreferencesBindings />;
              }
            })()
          }
        </div>
      </div>
    </div>
  );
}

export default Preferences;