import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableDarkThemeThunk, enableLightThemeThunk } from '../store/actions/preferences';
import ToggleListGroup from './ToggleListGroup';
import ToggleListItem from './ToggleListItem';
import SidebarSectionHead from './SidebarSectionHead';

const PreferencesThemeInput = (): ReactElement => {
  const themeValue = useSelector((state: RootState) => state.preferences.theme);
  const [theme, setTheme] = useState(themeValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== theme) {
      switch(e.target.value) {
        case 'light': {
          dispatch(enableLightThemeThunk());
          setTheme('light');
          break;
        }
        case 'dark': {
          dispatch(enableDarkThemeThunk());
          setTheme('dark');
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
        text='Theme' />
      <ToggleListGroup
        type='radio'
        name='theme'
        value={theme}
        onChange={handleChange}>
        <ToggleListItem
          value='dark'
          checked={theme === 'dark'}>
          <ToggleListItem.Body>
            <ToggleListItem.Text>
              Dark
            </ToggleListItem.Text>
          </ToggleListItem.Body>
        </ToggleListItem>
        <ToggleListItem
          value='light'
          checked={theme === 'light'}>
          <ToggleListItem.Body>
            <ToggleListItem.Text>
              Light
            </ToggleListItem.Text>
          </ToggleListItem.Body>
        </ToggleListItem>
      </ToggleListGroup>
    </div>
  );
}

export default PreferencesThemeInput;