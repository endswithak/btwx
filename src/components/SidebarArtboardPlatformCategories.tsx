import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDevicePlatform } from '../store/actions/tool';
import SidebarArtboardPlatformCategory from './SidebarArtboardPlatformCategory';
import { DEVICES } from '../constants';

interface SidebarArtboardPlatformCategoriesProps {
  categories?: em.DeviceCategory[];
  onDeviceClick(device: em.Device): void;
  orientation: em.DeviceOrientationType;
}

const SidebarArtboardPlatformCategories = (props: SidebarArtboardPlatformCategoriesProps): ReactElement => {
  const { categories, onDeviceClick, orientation } = props;

  return (
    <>
      {
        categories.map((category, index) => (
          <SidebarArtboardPlatformCategory
            key={index}
            category={category}
            onDeviceClick={onDeviceClick}
            orientation={orientation} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool, canvasSettings } = state;
  const platformValue = tool.artboardToolDevicePlatform;
  const categories = platformValue === 'Custom' ? [{
    type: 'Custom',
    devices: canvasSettings.artboardPresets.allIds.reduce((result: em.ArtboardPreset[], current) => {
      result = [...result, canvasSettings.artboardPresets.byId[current]];
      return result;
    }, [])
  }] : DEVICES.find((platform) => platform.type === platformValue).categories;
  return { categories };
};

export default connect(
  mapStateToProps,
  { setArtboardToolDevicePlatform }
)(SidebarArtboardPlatformCategories);