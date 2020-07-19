import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDevicePlatform } from '../store/actions/tool';
import { SetArtboardToolDevicePlatformPayload, ToolTypes } from '../store/actionTypes/tool';
import SidebarSelect from './SidebarSelect';
import { DEVICES } from '../constants';

interface SidebarArtboardPlatformSelectorProps {
  platformValue?: em.DevicePlatformType;
  setArtboardToolDevicePlatform?(payload: SetArtboardToolDevicePlatformPayload): ToolTypes;
}

const SidebarArtboardPlatformSelector = (props: SidebarArtboardPlatformSelectorProps): ReactElement => {
  const { platformValue, setArtboardToolDevicePlatform } = props;

  const options: { value: em.DevicePlatformType; label: em.DevicePlatformType }[] = DEVICES.map((device) => {
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
  const { tool } = state;
  const platformValue = tool.artboardToolDevicePlatform;
  return { platformValue };
};

export default connect(
  mapStateToProps,
  { setArtboardToolDevicePlatform }
)(SidebarArtboardPlatformSelector);