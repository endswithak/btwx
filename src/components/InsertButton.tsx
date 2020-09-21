import React, { ReactElement } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionToolThunk, enableRectangleShapeToolThunk, enableEllipseShapeToolThunk, enableStarShapeToolThunk, enablePolygonShapeToolThunk, enableRoundedShapeToolThunk, enableLineShapeToolThunk, enableArtboardToolThunk, enableTextToolThunk } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import { addDocumentImage } from '../store/actions/documentSettings';
import { ToolState } from '../store/reducers/tool';
import TopbarDropdownButton from './TopbarDropdownButton';

interface InsertButtonProps {
  tool: ToolState;
  insertKnobOpen: boolean;
  enableRectangleShapeToolThunk(): ToolTypes;
  enableEllipseShapeToolThunk(): ToolTypes;
  enableStarShapeToolThunk(): ToolTypes;
  enablePolygonShapeToolThunk(): ToolTypes;
  enableRoundedShapeToolThunk(): ToolTypes;
  enableLineShapeToolThunk(): ToolTypes;
  enableSelectionToolThunk(): ToolTypes;
  enableArtboardToolThunk(): ToolTypes;
  enableTextToolThunk(): ToolTypes;
  addImageThunk?(payload: AddImagePayload): void;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const {
    tool,
    insertKnobOpen,
    enableRectangleShapeToolThunk,
    enableEllipseShapeToolThunk,
    enableSelectionToolThunk,
    enableStarShapeToolThunk,
    enablePolygonShapeToolThunk,
    enableRoundedShapeToolThunk,
    enableLineShapeToolThunk,
    enableArtboardToolThunk,
    enableTextToolThunk,
    addImageThunk
  } = props;

  const handleImageClick = (): void => {
    if (tool.type !== 'Selection') {
      enableSelectionToolThunk();
    }
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
        onClick: tool.type === 'Artboard' ? enableSelectionToolThunk : enableArtboardToolThunk,
        icon: 'artboard',
        isActive: tool.type === 'Artboard'
      },{
        label: 'Rectangle',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionToolThunk : enableRectangleShapeToolThunk,
        icon: 'rectangle',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'
      },{
        label: 'Rounded',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionToolThunk : enableRoundedShapeToolThunk,
        icon: 'rounded',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rounded'
      },{
        label: 'Ellipse',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionToolThunk : enableEllipseShapeToolThunk,
        icon: 'ellipse',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'
      },{
        label: 'Star',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionToolThunk : enableStarShapeToolThunk,
        icon: 'star',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Star'
      },{
        label: 'Polygon',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionToolThunk : enablePolygonShapeToolThunk,
        icon: 'polygon',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Polygon'
      },{
        label: 'Line',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionToolThunk : enableLineShapeToolThunk,
        icon: 'line',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Line'
      },{
        label: 'Text',
        onClick: tool.type === 'Text' ? enableSelectionToolThunk : enableTextToolThunk,
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
    enableRectangleShapeToolThunk,
    enableEllipseShapeToolThunk,
    enableStarShapeToolThunk,
    enablePolygonShapeToolThunk,
    enableRoundedShapeToolThunk,
    enableLineShapeToolThunk,
    enableSelectionToolThunk,
    enableArtboardToolThunk,
    enableTextToolThunk,
    addImageThunk,
    addDocumentImage
  }
)(InsertButton);