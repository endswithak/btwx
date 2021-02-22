import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setPreferencesTab } from '../store/actions/preferences';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleStackedButton from './ToggleStackedButton';
import Icon from './Icon';

const PreferencesTabs = (): ReactElement => {
  const tabValue = useSelector((state: RootState) => state.preferences.tab);
  const [tab, setTab] = useState(tabValue);
  const dispatch = useDispatch();

  const handleChange = (e: any): void => {
    if (e.target.value !== tab) {
      dispatch(setPreferencesTab({tab: e.target.value as Btwx.PreferencesTab}));
      setTab(e.target.value);
    }
  };

  useEffect(() => {
    if (tabValue !== tab) {
      setTab(tabValue);
    }
  }, [tabValue]);

  return (
    <div className='c-preferences__tabs'>
      <ToggleButtonGroup
        type='radio'
        name='preferences'
        value={tab}
        onChange={handleChange}
        size='small'>
        <ToggleStackedButton
          value='general'
          label='General'>
          <Icon
            name='btwx'
            size='small' />
        </ToggleStackedButton>
        <ToggleStackedButton
          value='bindings'
          label='Bindings'>
          <Icon
            name='bindings'
            size='small' />
        </ToggleStackedButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default PreferencesTabs;