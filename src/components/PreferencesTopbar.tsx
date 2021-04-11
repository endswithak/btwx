import { ipcRenderer } from 'electron';
import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { KeyBindingsState } from '../store/reducers/keyBindings';
import { resetAllKeyBindingsThunk } from '../store/actions/keyBindings';
import IconButton from './IconButton';

interface PreferencesTopbarProps {
  tab: Btwx.PreferencesTab;
}

const PreferencesTopbar = (props: PreferencesTopbarProps): ReactElement => {
  const { tab } = props;
  const allBindings = useSelector((state: RootState) => state.keyBindings.allBindings);
  const [dirty, setDirty] = useState(false);
  const [defaultBindings, setDefaultBindings] = useState<KeyBindingsState>(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (dirty && defaultBindings) {
      dispatch(resetAllKeyBindingsThunk(defaultBindings));
    }
  }

  useEffect(() => {
    let newDirty = false;
    if (!defaultBindings) {
      ipcRenderer.invoke('getElectronStore', 'keyBindings.defaults').then((allDefaultBindings: KeyBindingsState) => {
        newDirty = !allBindings.every((binding, index) => binding === allDefaultBindings.allBindings[index]);
        setDefaultBindings(allDefaultBindings);
      });
    } else {
      newDirty = !allBindings.every((binding, index) => binding === defaultBindings.allBindings[index]);
    }
    setDirty(newDirty);
  }, [allBindings]);

  return (
    <div className='c-preferences__topbar'>
      <div className='c-preferences__topbar-title'>
        <h1>
          {
            (() => {
              switch(tab) {
                case 'general':
                  return 'General';
                case 'bindings':
                  return 'Key Bindings';
                default:
                  return 'General';
              }
            })()
          }
        </h1>
      </div>
      <div className='c-preferences__topbar-actions'>
        {
          tab === 'bindings'
          ? <IconButton
              iconName='rewind'
              size='small'
              onClick={handleClick}
              disabled={!dirty} />
          : null
        }
      </div>
    </div>
  );
}

export default PreferencesTopbar;