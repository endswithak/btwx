import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { DEVICES } from '../constants';
import SidebarArtboardPlatformCategory from './SidebarArtboardPlatformCategory';

interface SidebarArtboardPlatformCategoriesProps {
  orientation: Btwx.DeviceOrientationType;
  onDeviceClick(device: Btwx.Device): void;
}

const SidebarArtboardPlatformCategories = (props: SidebarArtboardPlatformCategoriesProps): ReactElement => {
  const { orientation, onDeviceClick } = props;
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

export default SidebarArtboardPlatformCategories;