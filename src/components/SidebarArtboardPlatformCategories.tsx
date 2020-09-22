import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DEVICES } from '../constants';
import SidebarArtboardPlatformCategory from './SidebarArtboardPlatformCategory';

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
  const { documentSettings } = state;
  const platformValue = documentSettings.artboardPresets.platform;
  const categories = platformValue === 'Custom' ? [{
    type: 'Custom',
    devices: documentSettings.artboardPresets.allIds.reduce((result: em.ArtboardPreset[], current) => {
      result = [...result, documentSettings.artboardPresets.byId[current]];
      return result;
    }, [])
  }] : DEVICES.find((platform) => platform.type === platformValue).categories;
  return { categories };
};

export default connect(
  mapStateToProps
)(SidebarArtboardPlatformCategories);