import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { setViewShowLayersThunk, setViewShowStylesThunk, setViewShowEventsThunk } from '../store/actions/keyBindings';
import PreferencesBindingInput from './PreferencesBindingInput';
import SidebarSectionHead from './SidebarSectionHead';
import ListGroup from './ListGroup';

const PreferencesBindingsView = (): ReactElement => {
  const showLayers = useSelector((state: RootState) => state.keyBindings.view.showLayers);
  const showStyles = useSelector((state: RootState) => state.keyBindings.view.showStyles);
  const showEvents = useSelector((state: RootState) => state.keyBindings.view.showEvents);

  return (
    <div className='c-preferences__tab-section'>
      <div className='c-preferences__input-group'>
        <SidebarSectionHead
          text='View' />
        <ListGroup>
          <PreferencesBindingInput
            binding={showLayers}
            onChange={setViewShowLayersThunk}
            title='Toggle Layers'
            icon='left-sidebar'
            storeKey='view.showLayers' />
          <PreferencesBindingInput
            binding={showStyles}
            onChange={setViewShowStylesThunk}
            title='Toggle Styles'
            icon='right-sidebar'
            storeKey='view.showStyles' />
          <PreferencesBindingInput
            binding={showEvents}
            onChange={setViewShowEventsThunk}
            title='Toggle Events'
            icon='tweens'
            storeKey='view.showEvents' />
        </ListGroup>
      </div>
    </div>
  );
};

export default PreferencesBindingsView;