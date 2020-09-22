import React, { ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { SetArtboardPresetDevicePlatformPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { DEVICES } from '../constants';
import SidebarSelect from './SidebarSelect';

interface SidebarArtboardPlatformSelectorProps {
  platformValue?: em.DevicePlatformType;
  setArtboardPresetDevicePlatform?(payload: SetArtboardPresetDevicePlatformPayload): DocumentSettingsTypes;
  optionValues?: em.DevicePlatform[];
}

const SidebarArtboardPlatformSelector = (props: SidebarArtboardPlatformSelectorProps): ReactElement => {
  const { platformValue, setArtboardPresetDevicePlatform, optionValues } = props;

  const options: { value: em.DevicePlatformType; label: em.DevicePlatformType }[] = optionValues.map((device) => {
    return {
      value: device.type,
      label: device.type
    }
  });

  const [platform, setPlatform] = useState(options.find((option) => option.value === platformValue));

  const handleChange = (selectedOption: { value: em.DevicePlatformType; label: em.DevicePlatformType }) => {
    setPlatform(selectedOption);
    setArtboardPresetDevicePlatform({platform: selectedOption.value});
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

const mapStateToProps = (state: RootState) => {
  const { tool, documentSettings } = state;
  const platformValue = documentSettings.artboardPresets.platform;
  const optionValues = [
    ...DEVICES,
    {
      type: 'Custom',
      categories: [{
        type: 'Custom',
        devices: documentSettings.artboardPresets.allIds.reduce((result: em.ArtboardPreset[], current) => {
          result = [...result, documentSettings.artboardPresets.byId[current]];
          return result;
        }, [])
      }]
    }
  ]
  return { platformValue, optionValues };
};

export default connect(
  mapStateToProps,
  { setArtboardPresetDevicePlatform }
)(SidebarArtboardPlatformSelector);