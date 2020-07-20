import React, { useContext, ReactElement, useState } from 'react';
import SidebarArtboardPlatformDevice from './SidebarArtboardPlatformDevice';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';

interface SidebarArtboardPlatformCategoryProps {
  category: em.DeviceCategory;
  onDeviceClick(device: em.Device): void;
  orientation: em.DeviceOrientationType;
}

const SidebarArtboardPlatformCategory = (props: SidebarArtboardPlatformCategoryProps): ReactElement => {
  const { category, onDeviceClick, orientation } = props;

  return (
    <SidebarSection>
      {
        category.type !== 'Custom'
        ? <SidebarSectionRow>
            <SidebarSectionHead text={category.type} />
          </SidebarSectionRow>
        : null
      }
      <>
        {
          category.devices.map((device, index) => (
            <SidebarArtboardPlatformDevice
              key={index}
              device={device}
              onClick={onDeviceClick}
              orientation={orientation} />
          ))
        }
      </>
    </SidebarSection>
  );
}

export default SidebarArtboardPlatformCategory;