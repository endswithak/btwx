import React, { ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDevicePlatform } from '../store/actions/documentSettings';
import { SetArtboardPresetDevicePlatformPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { DEVICES } from '../constants';
import SidebarSelect from './SidebarSelect';

interface SidebarArtboardPlatformSelectorProps {
  platformValue?: Btwx.DevicePlatformType;
  setArtboardPresetDevicePlatform?(payload: SetArtboardPresetDevicePlatformPayload): DocumentSettingsTypes;
  optionValues?: Btwx.DevicePlatform[];
}

const SidebarArtboardPlatformSelector = (props: SidebarArtboardPlatformSelectorProps): ReactElement => {
  const { platformValue, setArtboardPresetDevicePlatform, optionValues } = props;

  const options: { value: Btwx.DevicePlatformType; label: Btwx.DevicePlatformType }[] = optionValues.map((device) => {
    return {
      value: device.type,
      label: device.type
    }
  });

  const [platform, setPlatform] = useState(options.find((option) => option.value === platformValue));

  const handleChange = (selectedOption: { value: Btwx.DevicePlatformType; label: Btwx.DevicePlatformType }) => {
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
  const { documentSettings } = state;
  const platformValue = documentSettings.artboardPresets.platform;
  const optionValues = [
    ...DEVICES,
    {
      type: 'Custom',
      categories: [{
        type: 'Custom',
        devices: documentSettings.artboardPresets.allIds.reduce((result: Btwx.ArtboardPreset[], current) => {
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