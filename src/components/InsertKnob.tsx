/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote, ipcRenderer } from 'electron';
import React, { useContext, ReactElement, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import tinyColor from 'tinycolor2';
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
const knobSwitchThreshold = 360 / knobLength;
let knobActive = false;
let knobIndex = 0;

let currentKnobPosThreshold = 0;
let currentKnobNegThreshold = 0;

if (remote.process.platform === 'darwin') {
  remote.getCurrentWindow().addListener('swipe', (event: any, direction: any) => {
    switch(direction) {
      case 'left': {
        if (knobActive) {
          currentKnobNegThreshold = 0;
          currentKnobPosThreshold = 0;
          knobActive = false;
          store.dispatch(deactivateInsertKnob());
        }
        break;
      }
      case 'right': {
        if (!knobActive) {
          knobActive = true;
          store.dispatch(enableSelectionTool());
          store.dispatch(activateInsertKnob());
        }
        break;
      }
    }
  });
}

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

  const insertKnobRef = useRef<HTMLUListElement>(null);
  const theme = useContext(ThemeContext);

  const insertKnobItems = [{
    label: 'Artboard',
    icon: 'artboard',
    onSelection: tool.type === 'Artboard' ? enableSelectionTool : enableArtboardTool
  },{
    label: 'Rectangle',
    icon: 'rectangle',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool
  },{
    label: 'Rounded',
    icon: 'rounded',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool
  },{
    label: 'Ellipse',
    icon: 'ellipse',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool
  },{
    label: 'Star',
    icon: 'star',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool
  },{
    label: 'Polygon',
    icon: 'polygon',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool
  },{
    label: 'Line',
    icon: 'line',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionTool : enableLineShapeTool
  },{
    label: 'Text',
    icon: 'text',
    onSelection: tool.type === 'Text' ? enableSelectionTool : enableTextTool
  },{
    label: 'Image',
    icon: 'image',
    onSelection: (): void => {
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
  }];

  const handleMouseDown = (event: any): void => {
    if (insertKnobRef.current && (!insertKnobRef.current.contains(event.target) || event.target === insertKnobRef.current)) {
      handleDeactivation();
    }
  }

  const handleKeyDown = (event: any): void => {
    switch(event.key) {
      case 'Enter': {
        if (knobActive) {
          insertKnobItems[knobIndex].onSelection();
          handleDeactivation();
        }
        break;
      }
      case 'Escape': {
        if (knobActive) {
          handleDeactivation();
        }
        break;
      }
    }
  }

  const handleDeactivation = () => {
    currentKnobNegThreshold = 0;
    currentKnobPosThreshold = 0;
    knobActive = false;
    deactivateInsertKnob();
  }

  const handleMouseEnter = (index: number): void => {
    currentKnobNegThreshold = 0;
    currentKnobPosThreshold = 0;
    setInsertKnobIndex({index});
  }

  const handleClick = (index: number): void => {
    insertKnobItems[index].onSelection();
    handleDeactivation();
  }

  const handleRotate = (event: any, rotation: any): void => {
    if (knobActive) {
      if ((rotation * knobLength) < 0) {
        currentKnobPosThreshold -= (rotation * knobLength);
        if (currentKnobPosThreshold >= knobSwitchThreshold) {
          if (knobIndex === knobLength) {
            store.dispatch(setInsertKnobIndex({index: 0}));
          } else {
            store.dispatch(setInsertKnobIndex({index: knobIndex + 1}));
          }
          currentKnobNegThreshold = 0;
          currentKnobPosThreshold = 0;
        }
      }
      if ((rotation * knobLength) > 0) {
        currentKnobNegThreshold -= (rotation * knobLength);
        if (currentKnobNegThreshold <= -knobSwitchThreshold) {
          if (knobIndex === 0) {
            store.dispatch(setInsertKnobIndex({index: knobLength}));
          } else {
            store.dispatch(setInsertKnobIndex({index: knobIndex - 1}));
          }
          currentKnobNegThreshold = 0;
          currentKnobPosThreshold = 0;
        }
      }
      if (rotation === 0) {
        currentKnobNegThreshold = 0;
        currentKnobPosThreshold = 0;
      }
    }
  }

  useEffect(() => {
    knobActive = true;
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('keydown', handleKeyDown, false);
    if (remote.process.platform === 'darwin') {
      remote.getCurrentWindow().addListener('rotate-gesture', handleRotate);
    }
    return (): void => {
      knobActive = false;
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      if (remote.process.platform === 'darwin') {
        remote.getCurrentWindow().removeListener('rotate-gesture', handleRotate);
      }
    }
  }, []);

  useEffect(() => {
    knobIndex = activeIndex;
  }, [activeIndex]);

  return (
    <div
      className='c-insert-knob'
      style={{
        background: tinyColor(theme.name === 'dark' ? theme.background.z1 : theme.background.z2).setAlpha(0.77).toRgbString(),
        backdropFilter: 'blur(17px)',
        boxShadow: `1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset, -1px 0 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <ul
        className='c-insert-knob__items'
        ref={insertKnobRef}>
        {
          insertKnobItems.map((item, index) => (
            <InsertKnobItem
              item={item}
              key={index}
              index={index}
              isActive={activeIndex === index}
              onClick={(): void => handleClick(index)}
              onMouseEnter={(): void => handleMouseEnter(index)} />
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