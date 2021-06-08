import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableAutoSaveThunk, disableAutoSaveThunk } from '../store/actions/preferences';
import ToggleListGroup from './ToggleListGroup';
import ToggleListItem from './ToggleListItem';
import SidebarSectionHead from './SidebarSectionHead';

const PreferencesAutoSaveInput = (): ReactElement => {
  const autoSaveValue = useSelector((state: RootState) => state.preferences.autoSave);
  const [autoSave, setAutoSave] = useState(autoSaveValue ? 'enabled' : 'disabled');
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== autoSave) {
      switch(e.target.value) {
        case 'enabled': {
          dispatch(enableAutoSaveThunk());
          setAutoSave('enabled');
          break;
        }
        case 'disabled': {
          dispatch(disableAutoSaveThunk());
          setAutoSave('disabled');
          break;
        }
        default:
          return;
      }
    }
  };

  return (
    <div className='c-preferences__input-group'>
      <SidebarSectionHead
        text='AutoSave' />
      <ToggleListGroup
        type='radio'
        name='autoSave'
        value={autoSave}
        onChange={handleChange}>
        <ToggleListItem
          value='enabled'
          checked={autoSave === 'enabled'}>
          <ToggleListItem.Body>
            <ToggleListItem.Text>
              Enabled
            </ToggleListItem.Text>
          </ToggleListItem.Body>
        </ToggleListItem>
        <ToggleListItem
          value='disabled'
          checked={autoSave === 'disabled'}>
          <ToggleListItem.Body>
            <ToggleListItem.Text>
              Disabled
            </ToggleListItem.Text>
          </ToggleListItem.Body>
        </ToggleListItem>
      </ToggleListGroup>
    </div>
  );
}

export default PreferencesAutoSaveInput;