import React, { useContext, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import SidebarSectionRow from './SidebarSectionRow';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformDeviceProps {
  device: em.Device;
  orientation?: em.DeviceOrientationType;
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
  const { device, orientation } = props;
  const theme = useContext(ThemeContext);

  return (
    <SidebarSectionRow
      justifyContent='space-between'
      alignItems='center'>
      <Device
        className='c-sidebar-artboard-platform-device'
        theme={theme}>
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

const mapStateToProps = (state: RootState) => {
  const { tool } = state;
  const orientation = tool.artboardToolOrientation;
  return { orientation };
};

export default connect(
  mapStateToProps
)(SidebarArtboardPlatformDevice);