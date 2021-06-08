import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import ListGroup from './ListGroup';
import ListItem from './ListItem';
import SidebarSectionHead from './SidebarSectionHead';

interface PreferencesAsideProps {
  tab: Btwx.PreferencesTab;
  setTab(tab: Btwx.PreferencesTab): void;
}

const PreferencesAside = (props: PreferencesAsideProps): ReactElement => {
  const { tab, setTab } = props;
  const theme = useSelector((state: RootState) => state.preferences.theme);

  return (
    <div className='c-preferences__aside'>
      <SidebarSectionHead
        text='Preferences' />
      <ListGroup>
        <ListItem
          isActive={tab === 'general'}
          onClick={() => setTab('general')}
          interactive>
          <ListItem.Icon
            name={`theme-${theme}`} />
          <ListItem.Body>
            <ListItem.Text>
              General
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
        <ListItem
          isActive={tab === 'bindings'}
          onClick={() => setTab('bindings')}
          interactive>
          <ListItem.Icon
            name='bindings' />
          <ListItem.Body>
            <ListItem.Text>
              Key Bindings
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
      </ListGroup>
    </div>
  );
}

export default PreferencesAside;