import React, { ReactElement } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import TopbarDropdownButton from './TopbarDropdownButton';

const InsertButton = (): ReactElement => {
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const shapeToolShapeType = useSelector((state: RootState) => state.shapeTool.shapeType);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const dispatch = useDispatch();

  const handleImageClick = (): void => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] }
      ],
      properties: ['openFile']
    }).then(result => {
      if (result.filePaths.length > 0 && !result.canceled) {
        sharp(result.filePaths[0]).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
          dispatch(addImageThunk({
            layer: {
              frame: {
                x: 0,
                y: 0,
                width: info.width,
                height: info.height,
                innerWidth: info.width,
                innerHeight: info.height
              },
              originalDimensions: {
                width: info.width,
                height: info.height
              }
            },
            buffer: data
          }));
        });
      }
    });
  }

  const getInsertButtonIcon = () => {
    switch(activeTool) {
      case 'Shape':
        switch(shapeToolShapeType) {
          case 'Rectangle':
            return 'rectangle';
          case 'Rounded':
            return 'rounded';
          case 'Ellipse':
            return 'ellipse';
          case 'Star':
            return 'star';
          case 'Polygon':
            return 'polygon';
          case 'Line':
            return 'line';
        }
        break;
      case 'Text':
        return 'text';
      case 'Artboard':
        return 'artboard';
      default:
        return 'insert';
    }
  }

  return (
    <TopbarDropdownButton
      dropdownPosition='left'
      label='Insert'
      icon={getInsertButtonIcon()}
      isActive={ activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' }
      options={[{
        label: 'Artboard',
        onClick: () => dispatch(toggleArtboardToolThunk()),
        icon: 'artboard',
        isActive: activeTool === 'Artboard',
        bottomDivider: true
      },{
        label: 'Rectangle',
        onClick: () => dispatch(toggleShapeToolThunk('Rectangle')),
        icon: 'rectangle',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rectangle',
        disabled: activeArtboard === null
      },{
        label: 'Rounded',
        onClick: () => dispatch(toggleShapeToolThunk('Rounded')),
        icon: 'rounded',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rounded',
        disabled: activeArtboard === null
      },{
        label: 'Ellipse',
        onClick: () => dispatch(toggleShapeToolThunk('Ellipse')),
        icon: 'ellipse',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Ellipse',
        disabled: activeArtboard === null
      },{
        label: 'Star',
        onClick: () => dispatch(toggleShapeToolThunk('Star')),
        icon: 'star',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Star',
        disabled: activeArtboard === null
      },{
        label: 'Polygon',
        onClick: () => dispatch(toggleShapeToolThunk('Polygon')),
        icon: 'polygon',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Polygon',
        disabled: activeArtboard === null
      },{
        label: 'Line',
        onClick: () => dispatch(toggleShapeToolThunk('Line')),
        icon: 'line',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Line',
        disabled: activeArtboard === null
      },{
        label: 'Text',
        onClick: () => dispatch(toggleTextToolThunk()),
        icon: 'text',
        isActive: activeTool === 'Text',
        disabled: activeArtboard === null
      },{
        label: 'Image',
        onClick: handleImageClick,
        icon: 'image',
        disabled: activeArtboard === null
      }]} />
  );
}

export default InsertButton;