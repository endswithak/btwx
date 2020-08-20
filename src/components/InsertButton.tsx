import React, { useContext, ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { paperMain } from '../canvas';
import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableRoundedShapeTool, enableLineShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { AddImagePayload, LayerTypes } from '../store/actionTypes/layer';
import { addImage } from '../store/actions/layer';
import { AddDocumentImagePayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { addDocumentImage } from '../store/actions/documentSettings';
import { ToolState } from '../store/reducers/tool';
import { ipcRenderer } from 'electron';
import { bufferToBase64 } from '../utils';
import { ThemeContext } from './ThemeProvider';
import TopbarDropdownButton from './TopbarDropdownButton';
import Icon from './Icon';

interface InsertButtonProps {
  tool: ToolState;
  allDocumentImageIds: string[];
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
  enableRectangleShapeTool(): ToolTypes;
  enableEllipseShapeTool(): ToolTypes;
  enableStarShapeTool(): ToolTypes;
  enablePolygonShapeTool(): ToolTypes;
  enableRoundedShapeTool(): ToolTypes;
  enableLineShapeTool(): ToolTypes;
  enableSelectionTool(): ToolTypes;
  enableArtboardTool(): ToolTypes;
  enableTextTool(): ToolTypes;
  addImage(payload: AddImagePayload): LayerTypes;
  addDocumentImage(payload: AddDocumentImagePayload): DocumentSettingsTypes;
}

const InsertButton = (props: InsertButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const {
    tool,
    documentImagesById,
    enableRectangleShapeTool,
    enableEllipseShapeTool,
    enableSelectionTool,
    enableStarShapeTool,
    enablePolygonShapeTool,
    enableRoundedShapeTool,
    enableLineShapeTool,
    enableArtboardTool,
    enableTextTool,
    addImage,
    addDocumentImage,
    allDocumentImageIds
  } = props;

  const handleImageClick = (): void => {
    if (tool.type !== 'Selection') {
      enableSelectionTool();
    }
    ipcRenderer.send('addImage');
    ipcRenderer.once('addImage-reply', (event, arg) => {
      const buffer = Buffer.from(JSON.parse(arg).data);
      const exists = allDocumentImageIds.length > 0 && allDocumentImageIds.find((id) => Buffer.from(documentImagesById[id].buffer).equals(buffer));
      const base64 = bufferToBase64(buffer);
      const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
      paperLayer.position = paperMain.view.center;
      paperLayer.onLoad = (): void => {
        if (exists) {
          addImage({paperLayer, imageId: exists});
        } else {
          const imageId = uuidv4();
          addImage({paperLayer, imageId: imageId});
          addDocumentImage({id: imageId, buffer: buffer});
        }
      }
    });
  }

  const getInsertButtonIcon = () => {
    switch(tool.type) {
      case 'Shape':
        switch(tool.shapeToolType) {
          case 'Rectangle':
            return Icon('rectangle');
          case 'Rounded':
            return Icon('rounded');
          case 'Ellipse':
            return Icon('ellipse');
          case 'Star':
            return Icon('star');
          case 'Polygon':
            return Icon('polygon');
          case 'Line':
            return Icon('line');
        }
        break;
      case 'Text':
        return Icon('text');
      case 'Artboard':
        return Icon('artboard');
      default:
        return Icon('insert');
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
        icon: Icon('artboard'),
        isActive: tool.type === 'Artboard'
      },{
        label: 'Rectangle',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool,
        icon: Icon('rectangle'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle'
      },{
        label: 'Rounded',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool,
        icon: Icon('rounded'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Rounded'
      },{
        label: 'Ellipse',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool,
        icon: Icon('ellipse'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse'
      },{
        label: 'Star',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool,
        icon: Icon('star'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Star'
      },{
        label: 'Polygon',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool,
        icon: Icon('polygon'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Polygon'
      },{
        label: 'Line',
        onClick: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionTool : enableLineShapeTool,
        icon: Icon('line'),
        isActive: tool.type === 'Shape' && tool.shapeToolType === 'Line'
      },{
        label: 'Text',
        onClick: tool.type === 'Text' ? enableSelectionTool : enableTextTool,
        icon: Icon('text'),
        isActive: tool.type === 'Text'
      },{
        label: 'Image',
        onClick: handleImageClick,
        icon: Icon('image'),
      }]} />
  );
}

const mapStateToProps = (state: RootState): {
  tool: ToolState;
  allDocumentImageIds: string[];
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
} => {
  const { tool, documentSettings } = state;
  const allDocumentImageIds = documentSettings.images.allIds;
  const documentImagesById = documentSettings.images.byId;
  return { tool, documentImagesById, allDocumentImageIds };
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
    addImage,
    addDocumentImage
  }
)(InsertButton);