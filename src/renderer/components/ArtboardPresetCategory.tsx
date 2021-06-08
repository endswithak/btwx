import React, { ReactElement } from 'react';
import ArtboardPreset from './ArtboardPreset';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionHead from './SidebarSectionHead';
import ListGroup from './ListGroup';

interface ArtboardPresetCategoryProps {
  category: Btwx.DeviceCategory;
}

const ArtboardPresetCategory = (props: ArtboardPresetCategoryProps): ReactElement => {
  const { category } = props;

  return (
    <SidebarSection>
      {
        category.type !== 'Custom'
        ? <SidebarSectionRow>
            <SidebarSectionHead text={category.type} />
          </SidebarSectionRow>
        : null
      }
      <ListGroup>
        {
          category.devices.map((device, index) => (
            <ArtboardPreset
              key={index}
              device={device}/>
          ))
        }
      </ListGroup>
    </SidebarSection>
  );
}

export default ArtboardPresetCategory;