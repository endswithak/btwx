import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setArtboardPresetDeviceOrientation } from '../store/actions/documentSettings';
import { addArtboardThunk } from '../store/actions/layer';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { paperMain } from '../canvas';
import SidebarArtboardPlatformSelector from './SidebarArtboardPlatformSelector';
import SidebarArtboardPlatformOrientation from './SidebarArtboardPlatformOrientation';
import SidebarArtboardPlatformCategories from './SidebarArtboardPlatformCategories';
import SidebarArtboardPlatformAdd from './SidebarArtboardPlatformAdd';
import { ThemeContext } from './ThemeProvider';

const SidebarArtboardSizes = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const orientation = useSelector((state: RootState) => state.documentSettings.artboardPresets.orientation);
  const platform = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform);
  const dispatch = useDispatch();

  const handleOrientationClick = (type: Btwx.DeviceOrientationType): void => {
    switch(type) {
      case 'Landscape': {
        if (orientation !== 'Landscape') {
          dispatch(setArtboardPresetDeviceOrientation({orientation: 'Landscape'}));
        }
        break;
      }
      case 'Portrait': {
        if (orientation !== 'Portrait') {
          dispatch(setArtboardPresetDeviceOrientation({orientation: 'Portrait'}));
        }
        break;
      }
    }
  }

  const handleDeviceClick = (device: Btwx.Device): void => {
    const newArtboard = new paperMain.Path.Rectangle({
      from: new paperMain.Point(paperMain.view.center.x - ((orientation === 'Landscape' ? device.height : device.width) / 2), paperMain.view.center.y - ((orientation === 'Landscape' ? device.width : device.height) / 2)),
      to: new paperMain.Point(paperMain.view.center.x + ((orientation === 'Landscape' ? device.height : device.width) / 2), paperMain.view.center.y + ((orientation === 'Landscape' ? device.width : device.height) / 2)),
      insert: false
    });
    dispatch(addArtboardThunk({
      layer: {
        parent: 'root',
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
    }));
    dispatch(toggleArtboardToolThunk());
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

export default SidebarArtboardSizes;