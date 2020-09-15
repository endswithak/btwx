import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardToolDeviceOrientation, enableSelectionTool } from '../store/actions/tool';
import { SetArtboardToolDeviceOrientationPayload, ToolTypes } from '../store/actionTypes/tool';
import { addArtboardThunk } from '../store/actions/layer';
import { AddArtboardPayload } from '../store/actionTypes/layer';
import { paperMain } from '../canvas';
import SidebarArtboardPlatformSelector from './SidebarArtboardPlatformSelector';
import SidebarArtboardPlatformOrientation from './SidebarArtboardPlatformOrientation';
import SidebarArtboardPlatformCategories from './SidebarArtboardPlatformCategories';
import SidebarArtboardPlatformAdd from './SidebarArtboardPlatformAdd';
import { ThemeContext } from './ThemeProvider';

interface SidebarArtboardPlatformOrientationProps {
  selected?: string[];
  orientation?: em.DeviceOrientationType;
  platform?: em.DevicePlatformType;
  setArtboardToolDeviceOrientation?(payload: SetArtboardToolDeviceOrientationPayload): ToolTypes;
  addArtboardThunk?(payload: AddArtboardPayload): void;
  enableSelectionTool?(): ToolTypes;
}

const SidebarArtboardSizes = (props: SidebarArtboardPlatformOrientationProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, orientation, platform, setArtboardToolDeviceOrientation, addArtboardThunk, enableSelectionTool } = props;

  const handleOrientationClick = (type: em.DeviceOrientationType) => {
    switch(type) {
      case 'Landscape': {
        if (orientation !== 'Landscape') {
          setArtboardToolDeviceOrientation({orientation: 'Landscape'});
        }
        break;
      }
      case 'Portrait': {
        if (orientation !== 'Portrait') {
          setArtboardToolDeviceOrientation({orientation: 'Portrait'});
        }
        break;
      }
    }
  }

  const handleDeviceClick = (device: em.Device) => {
    const newArtboard = new paperMain.Path.Rectangle({
      from: new paperMain.Point(paperMain.view.center.x - ((orientation === 'Landscape' ? device.height : device.width) / 2), paperMain.view.center.y - ((orientation === 'Landscape' ? device.width : device.height) / 2)),
      to: new paperMain.Point(paperMain.view.center.x + ((orientation === 'Landscape' ? device.height : device.width) / 2), paperMain.view.center.y + ((orientation === 'Landscape' ? device.width : device.height) / 2)),
      insert: false
    });
    addArtboardThunk({
      layer: {
        parent: 'page',
        name: device.type,
        frame: {
          x: newArtboard.position.x,
          y: newArtboard.position.y,
          width: newArtboard.bounds.width,
          height: newArtboard.bounds.height,
          innerWidth: newArtboard.bounds.width,
          innerHeight: newArtboard.bounds.height
        }
      } as any
    });
    enableSelectionTool();
  }

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
          <SidebarArtboardPlatformOrientation
            orientation={orientation}
            onClick={handleOrientationClick}
            isDisabled={platform === 'Custom'} />
        </div>
      </div>
      <div className='c-sidebar-artboard-sizes__categories'>
        <SidebarArtboardPlatformCategories
          orientation={orientation}
          onDeviceClick={handleDeviceClick} />
      </div>
      <div
        className='c-sidebar-artboard-sizes__add-custom'
        style={{
          background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
          boxShadow: `0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
        }}>
        <SidebarArtboardPlatformAdd />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { tool, layer } = state;
  const selected = layer.present.selected;
  const orientation = tool.artboardToolOrientation;
  const platform = tool.artboardToolDevicePlatform;
  return { orientation, platform, selected };
};

export default connect(
  mapStateToProps,
  { setArtboardToolDeviceOrientation, addArtboardThunk, enableSelectionTool }
)(SidebarArtboardSizes);