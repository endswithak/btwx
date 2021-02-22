import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import PreferencesTabs from './PreferencesTabs';
import PreferencesGeneral from './PreferencesGeneral';
import PreferencesBindings from './PreferencesBindings';

const Preferences = (): ReactElement => {
  const tab = useSelector((state: RootState) => state.preferences.tab);
  const dispatch = useDispatch();

  return (
    <div className='c-preferences'>
      <PreferencesTabs />
      <div className='c-preferences__content'>
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
  );
}

export default Preferences;