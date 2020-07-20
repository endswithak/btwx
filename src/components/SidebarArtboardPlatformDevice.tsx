import React, { useContext, ReactElement, useState } from 'react';
import styled from 'styled-components';
import SidebarSectionRow from './SidebarSectionRow';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformDeviceProps {
  device: em.Device;
  orientation: em.DeviceOrientationType;
  onClick(device: em.Device): void;
}

const Device = styled.button`
  .c-sidebar-artboard-platform-device__name {
    color: ${props => props.theme.text.base};
  }
  .c-sidebar-artboard-platform-device__size {
    color: ${props => props.theme.text.lighter};
  }
  :hover {
    background: ${props => props.theme.palette.primary};
    .c-sidebar-artboard-platform-device__name {
      color: ${props => props.theme.text.onPrimary};
    }
    .c-sidebar-artboard-platform-device__size {
      color: ${props => props.theme.text.onPrimary};
    }
  }
`;

const SidebarArtboardPlatformDevice = (props: SidebarArtboardPlatformDeviceProps): ReactElement => {
  const { device, orientation, onClick } = props;
  const theme = useContext(ThemeContext);

  return (
    <SidebarSectionRow
      justifyContent='space-between'
      alignItems='center'>
      <Device
        className='c-sidebar-artboard-platform-device'
        theme={theme}
        onClick={() => onClick(device)}>
        <span className='c-sidebar-artboard-platform-device__name'>
          {device.type ? device.type : device.name}
        </span>
        <span className='c-sidebar-artboard-platform-device__size'>
          {`${orientation === 'Landscape' ? device.height : device.width}x${orientation === 'Landscape' ? device.width : device.height}`}
        </span>
      </Device>
    </SidebarSectionRow>
  );
}

export default SidebarArtboardPlatformDevice;