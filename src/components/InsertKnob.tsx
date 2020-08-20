import { remote, ipcRenderer } from 'electron';
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { paperMain } from '../canvas';
import store from '../store';
import { RootState } from '../store/reducers';
import { activateInsertKnob, deactivateInsertKnob, setInsertKnobIndex } from '../store/actions/insertKnob';
import { InsertKnobTypes, SetInsertKnobIndexPayload } from '../store/actionTypes/insertKnob';
import { enableSelectionTool, enableRectangleShapeTool, enableEllipseShapeTool, enableStarShapeTool, enablePolygonShapeTool, enableRoundedShapeTool, enableLineShapeTool, enableArtboardTool, enableTextTool } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { AddImagePayload, LayerTypes } from '../store/actionTypes/layer';
import { addImage } from '../store/actions/layer';
import { AddDocumentImagePayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { addDocumentImage } from '../store/actions/documentSettings';
import { ToolState } from '../store/reducers/tool';
import { bufferToBase64 } from '../utils';
import { ThemeContext } from './ThemeProvider';
import InsertKnobItem from './InsertKnobItem';
import Icon from './Icon';

const knobLength = 8;
const maxKnobRotation = 360;
const minKnobRotation = 0;
let knobRotation = 0;
let knobActiveIndex = 0;
let prevKnobActiveIndex = 0;
let isInsertKnobActive = false;

remote.getCurrentWindow().addListener('rotate-gesture', (event, rotation) => {
  if (isInsertKnobActive) {
    knobRotation -= (rotation * knobLength);
    if (knobRotation < minKnobRotation) {
      knobRotation = maxKnobRotation;
    }
    if (knobRotation > maxKnobRotation) {
      knobRotation = minKnobRotation;
    }
    knobActiveIndex = Math.round((knobRotation / maxKnobRotation) * knobLength);
    if (prevKnobActiveIndex !== knobActiveIndex) {
      store.dispatch(setInsertKnobIndex({index: knobActiveIndex}));
      prevKnobActiveIndex = knobActiveIndex;
    }
  }
});

remote.getCurrentWindow().addListener('swipe', (event, direction) => {
  switch(direction) {
    case 'left': {
      if (isInsertKnobActive) {
        knobRotation = 0;
        knobActiveIndex = 0;
        isInsertKnobActive = false;
        store.dispatch(deactivateInsertKnob());
        store.dispatch(setInsertKnobIndex({index: 0}));
      }
      break;
    }
    case 'right': {
      if (!isInsertKnobActive) {
        isInsertKnobActive = true;
        store.dispatch(enableSelectionTool());
        store.dispatch(activateInsertKnob());
      }
      break;
    }
  }
});

interface InsertKnobProps {
  tool?: ToolState;
  allDocumentImageIds?: string[];
  documentImagesById?: {
    [id: string]: em.DocumentImage;
  };
  activeIndex?: number;
  setInsertKnobIndex?(payload: SetInsertKnobIndexPayload): InsertKnobTypes;
  activateInsertKnob?(): InsertKnobTypes;
  deactivateInsertKnob?(): InsertKnobTypes;
  enableRectangleShapeTool?(): ToolTypes;
  enableEllipseShapeTool?(): ToolTypes;
  enableStarShapeTool?(): ToolTypes;
  enablePolygonShapeTool?(): ToolTypes;
  enableRoundedShapeTool?(): ToolTypes;
  enableLineShapeTool?(): ToolTypes;
  enableSelectionTool?(): ToolTypes;
  enableArtboardTool?(): ToolTypes;
  enableTextTool?(): ToolTypes;
  addImage?(payload: AddImagePayload): LayerTypes;
  addDocumentImage?(payload: AddDocumentImagePayload): DocumentSettingsTypes;
}

const InsertKnob = (props: InsertKnobProps): ReactElement => {
  const {
    tool,
    allDocumentImageIds,
    documentImagesById,
    activeIndex,
    setInsertKnobIndex,
    deactivateInsertKnob,
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
  } = props;

  const theme = useContext(ThemeContext);

  const handleImageSelection = (): void => {
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

  const insertKnobItems = [{
    label: 'Artboard',
    icon: Icon('artboard'),
    onSelection: tool.type === 'Artboard' ? enableSelectionTool : enableArtboardTool
  },{
    label: 'Rectangle',
    icon: Icon('rectangle'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool
  },{
    label: 'Rounded',
    icon: Icon('rounded'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool
  },{
    label: 'Ellipse',
    icon: Icon('ellipse'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool
  },{
    label: 'Star',
    icon: Icon('star'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool
  },{
    label: 'Polygon',
    icon: Icon('polygon'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool
  },{
    label: 'Line',
    icon: Icon('line'),
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionTool : enableLineShapeTool
  },{
    label: 'Text',
    icon: Icon('text'),
    onSelection: tool.type === 'Text' ? enableSelectionTool : enableTextTool
  },{
    label: 'Image',
    icon: Icon('image'),
    onSelection: handleImageSelection
  }];

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'Enter': {
          if (isInsertKnobActive) {
            insertKnobItems[knobActiveIndex].onSelection();
            knobRotation = 0;
            knobActiveIndex = 0;
            isInsertKnobActive = false;
            setInsertKnobIndex({index: 0});
            deactivateInsertKnob();
          }
          break;
        }
        case 'Escape': {
          if (isInsertKnobActive) {
            knobRotation = 0;
            knobActiveIndex = 0;
            isInsertKnobActive = false;
            setInsertKnobIndex({index: 0});
            deactivateInsertKnob();
          }
          break;
        }
      }
    });
  }, []);

  return (
    <div className='c-insert-knob'>
      <ul className='c-insert-knob__items'>
        {
          insertKnobItems.map((item, index) => (
            <InsertKnobItem
              item={item}
              key={index}
              isActive={activeIndex === index} />
          ))
        }
      </ul>
    </div>
  );
}

const mapStateToProps = (state: RootState): {
  tool: ToolState;
  allDocumentImageIds: string[];
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
  activeIndex: number;
} => {
  const { tool, documentSettings, insertKnob } = state;
  const allDocumentImageIds = documentSettings.images.allIds;
  const documentImagesById = documentSettings.images.byId;
  const activeIndex = insertKnob.index;
  return { tool, documentImagesById, allDocumentImageIds, activeIndex };
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
    addDocumentImage,
    activateInsertKnob,
    deactivateInsertKnob,
    setInsertKnobIndex
  }
)(InsertKnob);