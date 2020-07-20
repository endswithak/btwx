import React, { useContext, ReactElement, useState } from 'react';
import SidebarToggleButton from './SidebarToggleButton';

interface SidebarArtboardPlatformOrientationProps {
  orientation?: em.DeviceOrientationType;
  onClick(orientation: em.DeviceOrientationType): void;
  isDisabled?: boolean;
}

const SidebarArtboardPlatformOrientation = (props: SidebarArtboardPlatformOrientationProps): ReactElement => {
  const { orientation, onClick, isDisabled } = props;

  return (
    <>
      <SidebarToggleButton
        active={orientation === 'Portrait'}
        onClick={() => onClick('Portrait')}
        disabled={isDisabled}>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'>
          <rect x='8' y='4' width='8' height='16' />
        </svg>
      </SidebarToggleButton>
      <SidebarToggleButton
        active={orientation === 'Landscape'}
        onClick={() => onClick('Landscape')}
        disabled={isDisabled}>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'>
          <rect x='4' y='8' width='16' height='8' />
        </svg>
      </SidebarToggleButton>
    </>
  );
}

export default SidebarArtboardPlatformOrientation;