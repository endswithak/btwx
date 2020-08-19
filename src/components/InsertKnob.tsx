import { remote, ipcRenderer } from 'electron';
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
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
import { ThemeContext } from './ThemeProvider';
import { bufferToBase64 } from '../utils';

const knobLength = 8;
const maxKnobRotation = 360;
const minKnobRotation = 0;
let knobRotation = 0;
let knobActiveIndex = 0;
let prevKnobActiveIndex = 0;
let isInsertKnobActive = false;

remote.getCurrentWindow().addListener('rotate-gesture', (event, rotation) => {
  if (isInsertKnobActive) {
    knobRotation += (rotation * knobLength);
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
  isActive?: boolean;
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

const InsertKnobItem = styled.div`
  background: ${props => props.theme.palette.primary};
  color: ${props => props.theme.text.onPrimary};
  svg {
    fill: ${props => props.theme.text.onPrimary};
  }
`;

const InsertKnob = (props: InsertKnobProps): ReactElement => {
  const {
    tool,
    allDocumentImageIds,
    documentImagesById,
    isActive,
    activeIndex,
    setInsertKnobIndex,
    activateInsertKnob,
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
  const [prevIsActive, setPrevIsActive] = useState(isActive);

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
    icon: 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z',
    onSelection: tool.type === 'Artboard' ? enableSelectionTool : enableArtboardTool
  },{
    label: 'Rectangle',
    icon: 'M4,4 L19.999,4 C19.9995523,4 20,4.00044772 20,4.001 L20,20 L20,20 L4,20 L4,4 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionTool : enableRectangleShapeTool
  },{
    label: 'Rounded',
    icon: 'M7.55555556,4 L16.4444444,4 C18.4081236,4 20,5.59187645 20,7.55555556 L20,16.4444444 C20,18.4081236 18.4081236,20 16.4444444,20 L7.55555556,20 C5.59187645,20 4,18.4081236 4,16.4444444 L4,7.55555556 C4,5.59187645 5.59187645,4 7.55555556,4 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionTool : enableRoundedShapeTool
  },{
    label: 'Ellipse',
    icon: 'M12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionTool : enableEllipseShapeTool
  },{
    label: 'Star',
    icon: 'M12,17.9252329 L6.4376941,21 L7.5,14.4875388 L3,9.8753882 L9.21884705,8.92523292 L11.9990948,3.00192861 C11.9993294,3.00142866 11.9999249,3.0012136 12.0004249,3.00144827 C12.0006362,3.00154743 12.0008061,3.00171735 12.0009052,3.00192861 L14.7811529,8.92523292 L14.7811529,8.92523292 L21,9.8753882 L16.5,14.4875388 L17.5623059,21 L12,17.9252329 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionTool : enableStarShapeTool
  },{
    label: 'Polygon',
    icon: 'M12.0006071,3.00046375 L20.9994457,9.87496475 C20.9997787,9.87521916 20.9999178,9.87565424 20.9997941,9.87605465 L17.5625237,20.9992952 C17.5623942,20.9997142 17.5620068,21 17.5615683,21 L6.43843174,21 C6.43799318,21 6.4376058,20.9997142 6.43747632,20.9992952 L3.00020594,9.87605465 C3.00008221,9.87565424 3.00022128,9.87521916 3.0005543,9.87496475 L11.9993929,3.00046375 C11.9997513,3.00018996 12.0002487,3.00018996 12.0006071,3.00046375 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionTool : enablePolygonShapeTool
  },{
    label: 'Line',
    icon: 'M18.7928932,3.79289322 C19.1834175,3.40236893 19.8165825,3.40236893 20.2071068,3.79289322 C20.5675907,4.15337718 20.5953203,4.72060824 20.2902954,5.11289944 L20.2071068,5.20710678 L5.20710678,20.2071068 C4.81658249,20.5976311 4.18341751,20.5976311 3.79289322,20.2071068 C3.43240926,19.8466228 3.40467972,19.2793918 3.70970461,18.8871006 L3.79289322,18.7928932 L18.7928932,3.79289322 Z',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionTool : enableLineShapeTool
  },{
    label: 'Text',
    icon: 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z',
    onSelection: tool.type === 'Text' ? enableSelectionTool : enableTextTool
  },{
    label: 'Image',
    icon: theme.name === 'dark' ? 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16.6243657,6.71118154 C16.9538983,6.79336861 17.2674833,6.9606172 17.5297066,7.21384327 C18.3242674,7.98114172 18.3463679,9.24727881 17.5790695,10.0418396 C16.811771,10.8364004 15.5456339,10.8585009 14.7510731,10.0912025 C14.4888499,9.8379764 14.3107592,9.53041925 14.21741,9.2034121 C14.8874902,9.37067575 15.6260244,9.1851639 16.1403899,8.65252287 C16.6547553,8.11988184 16.8143797,7.37532327 16.6243657,6.71118154 Z' : 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16,7 C17.1045695,7 18,7.8954305 18,9 C18,10.1045695 17.1045695,11 16,11 C14.8954305,11 14,10.1045695 14,9 C14,7.8954305 14.8954305,7 16,7 Z',
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
    isActive
    ? <div
        className='c-insert-knob-wrap'>
        <InsertKnobItem
          className='c-insert-knob'
          theme={theme}>
          <div className='c-insert-knob__icon'>
            <svg
              viewBox='0 0 24 24'
              width='24px'
              height='24px'>
              <path d={insertKnobItems[activeIndex].icon} />
            </svg>
          </div>
          <div className='c-insert-knob__label'>
            {insertKnobItems[activeIndex].label}
          </div>
        </InsertKnobItem>
      </div>
    : null
  );
}

const mapStateToProps = (state: RootState): {
  tool: ToolState;
  allDocumentImageIds: string[];
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
  isActive: boolean;
  activeIndex: number;
} => {
  const { tool, documentSettings, insertKnob, canvasSettings } = state;
  const allDocumentImageIds = documentSettings.images.allIds;
  const documentImagesById = documentSettings.images.byId;
  const isActive = !canvasSettings.zooming && insertKnob.isActive;
  const activeIndex = insertKnob.index;
  return { tool, documentImagesById, allDocumentImageIds, isActive, activeIndex };
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