import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDevicePlatform } from '../store/actions/tool';
import { SetArtboardToolDevicePlatformPayload, ToolTypes } from '../store/actionTypes/tool';
import SidebarSelect from './SidebarSelect';
import { DEVICES } from '../constants';

interface SidebarArtboardPlatformSelectorProps {
  platformValue?: em.DevicePlatformType;
  setArtboardToolDevicePlatform?(payload: SetArtboardToolDevicePlatformPayload): ToolTypes;
  optionValues?: em.DevicePlatform[];
}

const SidebarArtboardPlatformSelector = (props: SidebarArtboardPlatformSelectorProps): ReactElement => {
  const { platformValue, setArtboardToolDevicePlatform, optionValues } = props;

  const options: { value: em.DevicePlatformType; label: em.DevicePlatformType }[] = optionValues.map((device) => {
    return {
      value: device.type,
      label: device.type
    }
  });

  const [platform, setPlatform] = useState(options.find((option) => option.value === platformValue));

  const handleChange = (selectedOption: { value: em.DevicePlatformType; label: em.DevicePlatformType }) => {
    setPlatform(selectedOption);
    setArtboardToolDevicePlatform({platform: selectedOption.value});
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
  const platformValue = tool.artboardToolDevicePlatform;
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
  { setArtboardToolDevicePlatform }
)(SidebarArtboardPlatformSelector);