/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { openContextMenu } from '../store/actions/contextMenu';
import SidebarSectionRow from './SidebarSectionRow';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformDeviceProps {
  device: em.Device | em.ArtboardPreset;
  orientation: em.DeviceOrientationType;
  onClick(device: em.Device): void;
  isActive?: boolean;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

interface DeviceProps {
  isActive: boolean;
}

const Device = styled.button<DeviceProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : 'none'};
  .c-sidebar-artboard-platform-device__name {
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
  .c-sidebar-artboard-platform-device__size {
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
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
  const { device, orientation, onClick, openContextMenu, isActive } = props;
  const ref = useRef(null);
  const [active, setActive] = useState(isActive);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    setActive(isActive);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive]);

  const handleMouseDown = (e: any) => {
    if (!ref.current.contains(e.target)) {
      handleClose();
    }
  }

  const handleKeyDown = (e: any) => {
    // escape will unmount parent component
    if (e.key !== 'Escape') {
      handleClose();
    }
  }

  const handleClose = () => {
    setActive(false);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('keydown', handleKeyDown);
  }

  const handleContextMenu = (e: any) => {
    if (device.category === 'Custom') {
      openContextMenu({
        type: 'ArtboardCustomPreset',
        id: (device as em.ArtboardPreset).id,
        x: e.clientX,
        y: e.clientY,
        paperX: e.clientX,
        paperY: e.clientY,
        data: {
          type: device.type,
          width: device.width,
          height: device.width
        }
      });
      if (!active) {
        setActive(true);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
      }
    }
  }

  return (
    <SidebarSectionRow
      justifyContent='space-between'
      alignItems='center'>
      <Device
        ref={ref}
        className='c-sidebar-artboard-platform-device'
        theme={theme}
        onClick={() => onClick(device)}
        onContextMenu={handleContextMenu}
        isActive={active}>
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

const mapStateToProps = (state: RootState, ownProps: SidebarArtboardPlatformDeviceProps) => {
  const { artboardPresetEditor } = state;
  const isActive = ownProps.device.category === 'Custom' && (ownProps.device as em.ArtboardPreset).id === artboardPresetEditor.id;
  return { isActive };
};

export default connect(
  mapStateToProps,
  { openContextMenu }
)(SidebarArtboardPlatformDevice);