import React, { ReactElement } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import TopbarDropdownButton from './TopbarDropdownButton';

interface InsertButtonProps {
  activeTool?: Btwx.ToolType;
  shapeToolShapeType?: Btwx.ShapeType;
  insertKnobOpen?: boolean;
  activeArtboard?: string;
  toggleShapeToolThunk?(shapeType: Btwx.ShapeType): void;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  addImageThunk?(payload: AddImagePayload): void;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const {
    activeTool,
    shapeToolShapeType,
    insertKnobOpen,
    activeArtboard,
    toggleShapeToolThunk,
    toggleArtboardToolThunk,
    toggleTextToolThunk,
    addImageThunk
  } = props;

  const handleImageClick = (): void => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      filters: [
        { name: 'Images', extensions: ['jpg', 'png'] }
      ],
      properties: ['openFile']
    }).then(result => {
      if (result.filePaths.length > 0 && !result.canceled) {
        sharp(result.filePaths[0]).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
          addImageThunk({
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
          });
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
      isActive={ activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' || insertKnobOpen }
      options={[{
        label: 'Artboard',
        onClick: toggleArtboardToolThunk,
        icon: 'artboard',
        isActive: activeTool === 'Artboard',
        bottomDivider: true
      },{
        label: 'Rectangle',
        onClick: () => toggleShapeToolThunk('Rectangle'),
        icon: 'rectangle',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rectangle',
        disabled: activeArtboard === null
      },{
        label: 'Rounded',
        onClick: () => toggleShapeToolThunk('Rounded'),
        icon: 'rounded',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rounded',
        disabled: activeArtboard === null
      },{
        label: 'Ellipse',
        onClick: () => toggleShapeToolThunk('Ellipse'),
        icon: 'ellipse',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Ellipse',
        disabled: activeArtboard === null
      },{
        label: 'Star',
        onClick: () => toggleShapeToolThunk('Star'),
        icon: 'star',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Star',
        disabled: activeArtboard === null
      },{
        label: 'Polygon',
        onClick: () => toggleShapeToolThunk('Polygon'),
        icon: 'polygon',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Polygon',
        disabled: activeArtboard === null
      },{
        label: 'Line',
        onClick: () => toggleShapeToolThunk('Line'),
        icon: 'line',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Line',
        disabled: activeArtboard === null
      },{
        label: 'Text',
        onClick: toggleTextToolThunk,
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

const mapStateToProps = (state: RootState): {
  activeTool: Btwx.ToolType;
  shapeToolShapeType: Btwx.ShapeType;
  insertKnobOpen: boolean;
  activeArtboard: string;
} => {
  const { canvasSettings, insertKnob, shapeTool, layer } = state;
  const activeTool = canvasSettings.activeTool;
  const shapeToolShapeType = shapeTool.shapeType;
  const insertKnobOpen = insertKnob.isActive;
  const activeArtboard = layer.present.activeArtboard;
  return { activeTool, shapeToolShapeType, insertKnobOpen, activeArtboard };
};

export default connect(
  mapStateToProps,
  {
    toggleShapeToolThunk,
    toggleArtboardToolThunk,
    toggleTextToolThunk,
    addImageThunk
  }
)(InsertButton);