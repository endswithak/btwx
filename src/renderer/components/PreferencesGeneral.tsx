import React, { ReactElement } from 'react';
import PreferencesThemeInput from './PreferencesThemeInput';
import PreferencesCanvasThemeInput from './PreferencesCanvasThemeInput';
import PreferencesAutoSaveInput from './PreferencesAutoSaveInput';

const PreferencesGeneral = (): ReactElement => (
  <div className='c-preferences__tab'>
    <div className='c-preferences__tab-section'>
      <PreferencesThemeInput />
      <PreferencesCanvasThemeInput />
    </div>
    <div className='c-preferences__tab-section'>
      <PreferencesAutoSaveInput />
    </div>
  </div>
);

export default PreferencesGeneral;