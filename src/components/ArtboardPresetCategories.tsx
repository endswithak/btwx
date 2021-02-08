import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { DEVICES } from '../constants';
import ArtboardPresetCategory from './ArtboardPresetCategory';

const ArtboardPresetCategories = (): ReactElement => {
  const categories = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform === 'Custom' ? [{
    type: 'Custom',
    devices: state.documentSettings.artboardPresets.allIds.reduce((result: Btwx.ArtboardPreset[], current) => {
      result = [...result, state.documentSettings.artboardPresets.byId[current]];
      return result;
    }, [])
  }] : DEVICES.find((platform) => platform.type === state.documentSettings.artboardPresets.platform).categories) as Btwx.DeviceCategory[];

  return (
    <>
      {
        categories.map((category, index) => (
          <ArtboardPresetCategory
            key={index}
            category={category} />
        ))
      }
    </>
  );
}

export default ArtboardPresetCategories;