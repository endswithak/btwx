import React, { useContext, ReactElement, useState } from 'react';
import SidebarArtboardPlatformDevice from './SidebarArtboardPlatformDevice';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';

interface SidebarArtboardPlatformCategoryProps {
  category: em.DeviceCategory;
}

const SidebarArtboardPlatformCategory = (props: SidebarArtboardPlatformCategoryProps): ReactElement => {
  const { category } = props;

  return (
    <SidebarSection>
      <SidebarSectionRow>
        <SidebarSectionHead text={category.type} />
      </SidebarSectionRow>
      <>
        {
          category.devices.map((device, index) => (
            <SidebarArtboardPlatformDevice
              key={index}
              device={device} />
          ))
        }
      </>
    </SidebarSection>
  );
}

export default SidebarArtboardPlatformCategory;