import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SidebarSectionRow from './SidebarSectionRow';
import { ThemeContext } from './ThemeProvider';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { openContextMenu } from '../store/actions/contextMenu';

interface SidebarArtboardPlatformDeviceProps {
  device: em.Device | em.ArtboardPreset;
  orientation: em.DeviceOrientationType;
  onClick(device: em.Device): void;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
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
  const { device, orientation, onClick, openContextMenu } = props;
  const theme = useContext(ThemeContext);

  const handleContextMenu = (e: any) => {
    openContextMenu({
      type: 'ArtboardCustomPreset',
      x: e.clientX,
      y: e.clientY,
      id: (device as em.ArtboardPreset).id,
      data: {
        type: device.type,
        width: device.width,
        height: device.width
      }
    });
  }

  return (
    <SidebarSectionRow
      justifyContent='space-between'
      alignItems='center'>
      <Device
        className='c-sidebar-artboard-platform-device'
        theme={theme}
        onClick={() => onClick(device)}
        onContextMenu={handleContextMenu}>
        <span className='c-sidebar-artboard-platform-device__name'>
          {device.type}
        </span>
        <span className='c-sidebar-artboard-platform-device__size'>
          {`${orientation === 'Landscape' ? device.height : device.width}x${orientation === 'Landscape' ? device.width : device.height}`}
        </span>
      </Device>
    </SidebarSectionRow>
  );
}

export default connect(
  null,
  { openContextMenu }
)(SidebarArtboardPlatformDevice);