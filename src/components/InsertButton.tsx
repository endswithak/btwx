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
            layer: {},
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
      label='Insert'
      icon={getInsertButtonIcon()}
      isActive={ activeTool === 'Artboard' || activeTool === 'Shape' || activeTool === 'Text' || insertKnobOpen }
      options={[{
        label: 'Artboard',
        onClick: toggleArtboardToolThunk,
        icon: 'artboard',
        isActive: activeTool === 'Artboard'
      },{
        label: 'Rectangle',
        onClick: () => toggleShapeToolThunk('Rectangle'),
        icon: 'rectangle',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rectangle'
      },{
        label: 'Rounded',
        onClick: () => toggleShapeToolThunk('Rounded'),
        icon: 'rounded',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Rounded'
      },{
        label: 'Ellipse',
        onClick: () => toggleShapeToolThunk('Ellipse'),
        icon: 'ellipse',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Ellipse'
      },{
        label: 'Star',
        onClick: () => toggleShapeToolThunk('Star'),
        icon: 'star',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Star'
      },{
        label: 'Polygon',
        onClick: () => toggleShapeToolThunk('Polygon'),
        icon: 'polygon',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Polygon'
      },{
        label: 'Line',
        onClick: () => toggleShapeToolThunk('Line'),
        icon: 'line',
        isActive: activeTool === 'Shape' && shapeToolShapeType === 'Line'
      },{
        label: 'Text',
        onClick: toggleTextToolThunk,
        icon: 'text',
        isActive: activeTool === 'Text'
      },{
        label: 'Image',
        onClick: handleImageClick,
        icon: 'image',
      }]} />
  );
}

const mapStateToProps = (state: RootState): {
  activeTool: Btwx.ToolType;
  shapeToolShapeType: Btwx.ShapeType;
  insertKnobOpen: boolean;
} => {
  const { canvasSettings, insertKnob, shapeTool } = state;
  const activeTool = canvasSettings.activeTool;
  const shapeToolShapeType = shapeTool.shapeType;
  const insertKnobOpen = insertKnob.isActive;
  return { activeTool, shapeToolShapeType, insertKnobOpen };
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