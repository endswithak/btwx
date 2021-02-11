/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addArtboardThunk } from '../store/actions/layer';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { openContextMenu } from '../store/actions/contextMenu';
import ListItem from './ListItem';

interface ArtboardPresetProps {
  device: Btwx.Device | Btwx.ArtboardPreset;
}

const ArtboardPreset = (props: ArtboardPresetProps): ReactElement => {
  const { device } = props;
  const orientation = useSelector((state: RootState) => state.documentSettings.artboardPresets.orientation);
  const isActive = useSelector((state: RootState) => device.category && device.category === 'Custom' && (device as Btwx.ArtboardPreset).id === state.artboardPresetEditor.id);
  const artboardWidth = orientation === 'Landscape' ? device.height : device.width;
  const artboardHeight = orientation === 'Landscape' ? device.width : device.height;
  const dispatch = useDispatch();

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
    }
  }

  const handleDeviceClick = (): void => {
    const newArtboard = new paperMain.Path.Rectangle({
      from: new paperMain.Point(paperMain.view.center.x - (artboardWidth / 2), paperMain.view.center.y - (artboardHeight / 2)),
      to: new paperMain.Point(paperMain.view.center.x + (artboardWidth / 2), paperMain.view.center.y + (artboardHeight / 2)),
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
    <ListItem
      onClick={handleDeviceClick}
      onContextMenu={handleContextMenu}
      isActive={isActive}
      interactive>
      <ListItem.Body>
        <ListItem.Text textStyle='body-1'>
          { device.type }
        </ListItem.Text>
      </ListItem.Body>
      <ListItem.Right>
        <ListItem.Text textStyle='body-2'>
          {`${artboardWidth}x${artboardHeight}`}
        </ListItem.Text>
      </ListItem.Right>
    </ListItem>
  );
}

export default ArtboardPreset;