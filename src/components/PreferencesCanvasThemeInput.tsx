import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setCanvasThemeThunk } from '../store/actions/preferences';
import ToggleListGroup from './ToggleListGroup';
import ToggleListItem from './ToggleListItem';
import SidebarSectionHead from './SidebarSectionHead';

const PreferencesCanvasThemeInput = (): ReactElement => {
  const themeValue = useSelector((state: RootState) => state.preferences.canvasTheme);
  const [theme, setTheme] = useState(themeValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== theme) {
      dispatch(setCanvasThemeThunk({canvasTheme: e.target.value}));
      setTheme(e.target.value);
    }
  };

  return (
    <div className='c-preferences__input-group'>
      <SidebarSectionHead
        text='Canvas' />
      <ToggleListGroup
        type='radio'
        name='canvas-theme'
        value={theme}
        onChange={handleChange}>
        <ToggleListItem
          value='btwx-default'
          checked={theme === 'btwx-default'}>
          <ToggleListItem.Body>
            <ToggleListItem.Text>
              Default
            </ToggleListItem.Text>
          </ToggleListItem.Body>
        </ToggleListItem>
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

export default PreferencesCanvasThemeInput;