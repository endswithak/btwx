import React, { useContext, ReactElement, useState } from 'react';
import SidebarArtboardPlatformSelector from './SidebarArtboardPlatformSelector';
import SidebarArtboardPlatformOrientation from './SidebarArtboardPlatformOrientation';
import SidebarArtboardPlatformCategories from './SidebarArtboardPlatformCategories';
import { ThemeContext } from './ThemeProvider';

const SidebarArtboardSizes = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className='c-sidebar-artboard-sizes'>
      <div
        className='c-sidebar-artboard-sizes__selector'
        style={{
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
        }}>
        <div className='c-sidebar-artboard-sizes__platform'>
          <SidebarArtboardPlatformSelector />
        </div>
        <div className='c-sidebar-artboard-sizes__orientation'>
          <SidebarArtboardPlatformOrientation />
        </div>
      </div>
      <div className='c-sidebar-artboard-sizes__categories'>
        <SidebarArtboardPlatformCategories />
      </div>
    </div>
  );
}

export default SidebarArtboardSizes;