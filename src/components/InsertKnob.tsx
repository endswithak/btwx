/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import sharp from 'sharp';
import React, { useContext, ReactElement, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import tinyColor from 'tinycolor2';
import store from '../store';
import { RootState } from '../store/reducers';
import { activateInsertKnob, deactivateInsertKnob, setInsertKnobIndex } from '../store/actions/insertKnob';
import { InsertKnobTypes, SetInsertKnobIndexPayload } from '../store/actionTypes/insertKnob';
import { enableSelectionToolThunk, enableRectangleShapeToolThunk, enableEllipseShapeToolThunk, enableStarShapeToolThunk, enablePolygonShapeToolThunk, enableRoundedShapeToolThunk, enableLineShapeToolThunk, enableArtboardToolThunk, enableTextToolThunk } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
import { SetCanvasFocusingPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import { ToolState } from '../store/reducers/tool';
import { ThemeContext } from './ThemeProvider';
import InsertKnobItem from './InsertKnobItem';

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
          store.dispatch(setCanvasFocusing({focusing: true}));
        }
        break;
      }
      case 'right': {
        if (!knobActive) {
          knobActive = true;
          store.dispatch(enableSelectionToolThunk() as any);
          store.dispatch(activateInsertKnob());
        }
        break;
      }
    }
  });
}

interface InsertKnobProps {
  tool?: ToolState;
  activeIndex?: number;
  setInsertKnobIndex?(payload: SetInsertKnobIndexPayload): InsertKnobTypes;
  activateInsertKnob?(): InsertKnobTypes;
  deactivateInsertKnob?(): InsertKnobTypes;
  enableRectangleShapeToolThunk?(): ToolTypes;
  enableEllipseShapeToolThunk?(): ToolTypes;
  enableStarShapeToolThunk?(): ToolTypes;
  enablePolygonShapeToolThunk?(): ToolTypes;
  enableRoundedShapeToolThunk?(): ToolTypes;
  enableLineShapeToolThunk?(): ToolTypes;
  enableSelectionToolThunk?(): ToolTypes;
  enableArtboardToolThunk?(): ToolTypes;
  enableTextToolThunk?(): ToolTypes;
  addImageThunk?(payload: AddImagePayload): void;
  setCanvasFocusing?(payload: SetCanvasFocusingPayload): CanvasSettingsTypes;
}

const InsertKnob = (props: InsertKnobProps): ReactElement => {
  const {
    tool,
    activeIndex,
    setInsertKnobIndex,
    deactivateInsertKnob,
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
    setCanvasFocusing
  } = props;

  const insertKnobRef = useRef<HTMLUListElement>(null);
  const theme = useContext(ThemeContext);

  const insertKnobItems = [{
    label: 'Artboard',
    icon: 'artboard',
    onSelection: tool.type === 'Artboard' ? enableSelectionToolThunk : enableArtboardToolThunk
  },{
    label: 'Rectangle',
    icon: 'rectangle',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rectangle' ? enableSelectionToolThunk : enableRectangleShapeToolThunk
  },{
    label: 'Rounded',
    icon: 'rounded',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Rounded' ? enableSelectionToolThunk : enableRoundedShapeToolThunk
  },{
    label: 'Ellipse',
    icon: 'ellipse',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Ellipse' ? enableSelectionToolThunk : enableEllipseShapeToolThunk
  },{
    label: 'Star',
    icon: 'star',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Star' ? enableSelectionToolThunk : enableStarShapeToolThunk
  },{
    label: 'Polygon',
    icon: 'polygon',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Polygon' ? enableSelectionToolThunk : enablePolygonShapeToolThunk
  },{
    label: 'Line',
    icon: 'line',
    onSelection: tool.type === 'Shape' && tool.shapeToolType === 'Line' ? enableSelectionToolThunk : enableLineShapeToolThunk
  },{
    label: 'Text',
    icon: 'text',
    onSelection: tool.type === 'Text' ? enableSelectionToolThunk : enableTextToolThunk
  },{
    label: 'Image',
    icon: 'image',
    onSelection: (): void => {
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
          sharp(result.filePaths[0]).metadata().then(({ width }) => {
            sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              const newBuffer = Buffer.from(data);
              addImageThunk({
                layer: {
                  frame: {
                    width: info.width,
                    height: info.height,
                    innerWidth: info.width,
                    innerHeight: info.height
                  } as em.Frame
                },
                buffer: newBuffer
              });
            });
          });
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

  const handleDeactivation = (): void => {
    currentKnobNegThreshold = 0;
    currentKnobPosThreshold = 0;
    knobActive = false;
    deactivateInsertKnob();
    setCanvasFocusing({focusing: true});
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
    setCanvasFocusing({focusing: false});
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
  activeIndex: number;
} => {
  const { tool, insertKnob } = state;
  const activeIndex = insertKnob.index;
  return { tool, activeIndex };
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
    activateInsertKnob,
    deactivateInsertKnob,
    setInsertKnobIndex,
    setCanvasFocusing
  }
)(InsertKnob);