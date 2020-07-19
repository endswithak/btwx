import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDeviceOrientation } from '../store/actions/tool';
import { SetArtboardToolDeviceOrientationPayload, ToolTypes } from '../store/actionTypes/tool';
import SidebarToggleButton from './SidebarToggleButton';

interface SidebarArtboardPlatformOrientationProps {
  orientationValue?: em.DeviceOrientationType;
  setArtboardToolDeviceOrientation?(payload: SetArtboardToolDeviceOrientationPayload): ToolTypes;
}

const SidebarArtboardPlatformOrientation = (props: SidebarArtboardPlatformOrientationProps): ReactElement => {
  const { orientationValue, setArtboardToolDeviceOrientation } = props;

  const handleClick = (type: em.DeviceOrientationType) => {
    switch(type) {
      case 'Landscape': {
        if (orientationValue !== 'Landscape') {
          setArtboardToolDeviceOrientation({orientation: 'Landscape'});
        }
        break;
      }
      case 'Portrait': {
        if (orientationValue !== 'Portrait') {
          setArtboardToolDeviceOrientation({orientation: 'Portrait'});
        }
        break;
      }
    }
  }

  return (
    <>
      <SidebarToggleButton
        active={orientationValue === 'Portrait'}
        onClick={() => handleClick('Portrait')}>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'>
          <rect x='8' y='4' width='8' height='16' />
        </svg>
      </SidebarToggleButton>
      <SidebarToggleButton
        active={orientationValue === 'Landscape'}
        onClick={() => handleClick('Landscape')}>
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

const mapStateToProps = (state: RootState) => {
  const { tool } = state;
  const orientationValue = tool.artboardToolOrientation;
  return { orientationValue };
};

export default connect(
  mapStateToProps,
  { setArtboardToolDeviceOrientation }
)(SidebarArtboardPlatformOrientation);