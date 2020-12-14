import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { DEVICES } from '../constants';
import SidebarSelect from './SidebarSelect';

const SidebarArtboardPlatformSelector = (): ReactElement => {
  const platformValue = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform);
  const optionValues = useSelector((state: RootState) => [
    ...DEVICES,
    {
      type: 'Custom',
      categories: [{
        type: 'Custom',
        devices: state.documentSettings.artboardPresets.allIds.reduce((result: Btwx.ArtboardPreset[], current) => {
          result = [...result, state.documentSettings.artboardPresets.byId[current]];
          return result;
        }, [])
      }]
    }
  ]);
  const dispatch = useDispatch();

  const options = optionValues.map((device) => ({
    value: device.type,
    label: device.type
  }));

  const [platform, setPlatform] = useState(options.find((option) => option.value === platformValue));

  const handleChange = (selectedOption: { value: Btwx.DevicePlatformType; label: Btwx.DevicePlatformType }): void => {
    setPlatform(selectedOption);
    dispatch(setArtboardPresetDevicePlatform({platform: selectedOption.value}));
  }

  useEffect(() => {
    setPlatform(options.find((option) => option.value === platformValue));
  }, [platformValue]);

  return (
    <SidebarSelect
      value={platform}
      onChange={handleChange}
      options={options}
      placeholder={'Platform'}
    />
  );
}

export default SidebarArtboardPlatformSelector;