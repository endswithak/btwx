import React, { ReactElement } from 'react';
import PreferencesBindingsInsert from './PreferencesBindingsInsert';
import PreferencesBindingsLayer from './PreferencesBindingsLayer';
import PreferencesBindingsArrange from './PreferencesBindingsArrange';
import PreferencesBindingsView from './PreferencesBindingsView';

const PreferencesBindings = (): ReactElement => (
  <div className='c-preferences__tab'>
    <PreferencesBindingsInsert />
    <PreferencesBindingsLayer />
    <PreferencesBindingsArrange />
    <PreferencesBindingsView />
  </div>
);

export default PreferencesBindings;