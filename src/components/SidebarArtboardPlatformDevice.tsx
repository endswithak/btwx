/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { openContextMenu } from '../store/actions/contextMenu';
import SidebarSectionRow from './SidebarSectionRow';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformDeviceProps {
  device: Btwx.Device | Btwx.ArtboardPreset;
  orientation: Btwx.DeviceOrientationType;
  onClick(device: Btwx.Device): void;
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
  const { device, orientation, onClick } = props;
  const ref = useRef(null);
  const isActive = useSelector((state: RootState) => device.category === 'Custom' && (device as Btwx.ArtboardPreset).id === state.artboardPresetEditor.id);
  const [active, setActive] = useState(isActive);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

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
      dispatch(openContextMenu({
        type: 'ArtboardCustomPreset',
        id: (device as Btwx.ArtboardPreset).id,
        x: e.clientX,
        y: e.clientY,
        paperX: e.clientX,
        paperY: e.clientY,
        data: {
          type: device.type,
          width: device.width,
          height: device.width
        }
      }));
      if (!active) {
        // setActive(true);
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

export default SidebarArtboardPlatformDevice;