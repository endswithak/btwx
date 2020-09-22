import React, { ReactElement } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleShapeToolThunk, toggleArtboardToolThunk, toggleTextToolThunk } from '../store/actions/tool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import { ToolState } from '../store/reducers/tool';
import TopbarDropdownButton from './TopbarDropdownButton';

interface InsertButtonProps {
  tool?: ToolState;
  insertKnobOpen?: boolean;
  toggleShapeToolThunk?(shapeType: em.ShapeType): void;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  addImageThunk?(payload: AddImagePayload): void;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const {
    tool,
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
        sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
          sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
            addImageThunk({
              layer: {
                frame: {
                  width: info.width,
                  height: info.height,
                  innerWidth: info.width,
                  innerHeight: info.height
                } as em.Frame
              },
              buffer: data
            });
          });
        });
      }
    });
  }

  const getInsertButtonIcon = () => {
    switch(tool.type) {
      case 'Shape':
        switch(tool.shapeToolType) {
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
      isActive={ tool.type === 'Artboard' || tool.type === 'Shape' || tool.type === 'Text' || insertKnobOpen }
      options={[{
        label: 'Artboard',
        onClick: toggleArtboardToolThunk,
        icon: 'artboard',
        isActive: tool.type === 'Artboard'
      },{
        label: 'Rectangle',
        onClick: () => toggleShapeToolThunk('Rectangle'),
        icon: 'rectangle',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'
      },{
        label: 'Rounded',
        onClick: () => toggleShapeToolThunk('Rounded'),
        icon: 'rounded',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rounded'
      },{
        label: 'Ellipse',
        onClick: () => toggleShapeToolThunk('Ellipse'),
        icon: 'ellipse',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'
      },{
        label: 'Star',
        onClick: () => toggleShapeToolThunk('Star'),
        icon: 'star',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Star'
      },{
        label: 'Polygon',
        onClick: () => toggleShapeToolThunk('Polygon'),
        icon: 'polygon',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Polygon'
      },{
        label: 'Line',
        onClick: () => toggleShapeToolThunk('Line'),
        icon: 'line',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Line'
      },{
        label: 'Text',
        onClick: toggleTextToolThunk,
        icon: 'text',
        isActive: tool.type === 'Text'
      },{
        label: 'Image',
        onClick: handleImageClick,
        icon: 'image',
      }]} />
  );
}

const mapStateToProps = (state: RootState): {
  tool: ToolState;
  insertKnobOpen: boolean;
} => {
  const { tool, insertKnob } = state;
  const insertKnobOpen = insertKnob.isActive;
  return { tool, insertKnobOpen };
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