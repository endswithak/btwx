import React, { ReactElement } from 'react';
import sharp from 'sharp';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableRoundedShapeTool, enableLineShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import { addDocumentImage } from '../store/actions/documentSettings';
import { ToolState } from '../store/reducers/tool';
import TopbarDropdownButton from './TopbarDropdownButton';

interface InsertButtonProps {
  tool: ToolState;
  enableRectangleShapeTool(): ToolTypes;
  enableEllipseShapeTool(): ToolTypes;
  enableStarShapeTool(): ToolTypes;
  enablePolygonShapeTool(): ToolTypes;
  enableRoundedShapeTool(): ToolTypes;
  enableLineShapeTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
  enableTextTool(): ToolTypes;
  addImageThunk?(payload: AddImagePayload): void;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const {
    tool,
    enableRectangleShapeTool,
    enableEllipseShapeTool,
    enableSelectionTool,
    enableStarShapeTool,
    enablePolygonShapeTool,
    enableRoundedShapeTool,
    enableLineShapeTool,
    enableArtboardTool,
    enableTextTool,
    addImageThunk
  } = props;

  const handleImageClick = (): void => {
    if (tool.type !== 'Selection') {
      enableSelectionTool();
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
      isActive={ tool.type === 'Artboard' || tool.type === 'Shape' || tool.type === 'Text' }
      options={[{
        label: 'Artboard',
        onClick: tool.type === 'Artboard' ? enableSelectionTool : enableArtboardTool,
        icon: 'artboard',
        isActive: tool.type === 'Artboard'
      },{
        label: 'Rectangle',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool,
        icon: 'rectangle',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'
      },{
        label: 'Rounded',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool,
        icon: 'rounded',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rounded'
      },{
        label: 'Ellipse',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool,
        icon: 'ellipse',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'
      },{
        label: 'Star',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool,
        icon: 'star',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Star'
      },{
        label: 'Polygon',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool,
        icon: 'polygon',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Polygon'
      },{
        label: 'Line',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionTool : enableLineShapeTool,
        icon: 'line',
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Line'
      },{
        label: 'Text',
        onClick: tool.type === 'Text' ? enableSelectionTool : enableTextTool,
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
} => {
  const { tool } = state;
  return { tool };
};

export default connect(
  mapStateToProps,
  {
    enableRectangleShapeTool,
    enableEllipseShapeTool,
    enableStarShapeTool,
    enablePolygonShapeTool,
    enableRoundedShapeTool,
    enableLineShapeTool,
    enableSelectionTool,
    enableArtboardTool,
    enableTextTool,
    addImageThunk,
    addDocumentImage
  }
)(InsertButton);