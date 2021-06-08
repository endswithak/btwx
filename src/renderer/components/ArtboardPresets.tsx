import React, { ReactElement } from 'react';
import ArtboardPresetPlatform from './ArtboardPresetPlatform';
import ArtboardPresetOrientation from './ArtboardPresetOrientation';
import ArtboardPresetCategories from './ArtboardPresetCategories';
import ArtboardPresetAddButton from './ArtboardPresetAddButton';

const ArtboardPresets = (): ReactElement => (
  <div className='c-artboard-presets'>
    <div className='c-artboard-presets__header'>
      <div className='c-artboard-presets__platform'>
        <ArtboardPresetPlatform />
      </div>
      <div className='c-artboard-presets__orientation'>
        <ArtboardPresetOrientation />
      </div>
    </div>
    <div className='c-artboard-presets__categories'>
      <ArtboardPresetCategories />
    </div>
    <div className='c-artboard-presets__footer'>
      <ArtboardPresetAddButton />
    </div>
  </div>
);

export default ArtboardPresets;