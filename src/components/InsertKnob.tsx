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
import { toggleArtboardToolThunk} from '../store/actions/artboardTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { AddImagePayload } from '../store/actionTypes/layer';
import { addImageThunk } from '../store/actions/layer';
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
        } else {
          const state = store.getState();
          if (state.preview.isOpen && !state.preview.focusing) {
            remote.BrowserWindow.fromId(state.preview.windowId).focus();
          }
        }
        break;
      }
      case 'right': {
        if (!knobActive) {
          knobActive = true;
          store.dispatch(activateInsertKnob());
        }
        break;
      }
    }
  });
}

interface InsertKnobProps {
  activeIndex?: number;
  setInsertKnobIndex?(payload: SetInsertKnobIndexPayload): InsertKnobTypes;
  activateInsertKnob?(): InsertKnobTypes;
  deactivateInsertKnob?(): InsertKnobTypes;
  toggleShapeToolThunk?(shapeType: em.ShapeType): void;
  toggleArtboardToolThunk?(): void;
  toggleTextToolThunk?(): void;
  addImageThunk?(payload: AddImagePayload): void;
}

const InsertKnob = (props: InsertKnobProps): ReactElement => {
  const {
    activeIndex,
    setInsertKnobIndex,
    deactivateInsertKnob,
    toggleShapeToolThunk,
    toggleArtboardToolThunk,
    toggleTextToolThunk,
    addImageThunk
  } = props;

  const insertKnobRef = useRef<HTMLUListElement>(null);
  const theme = useContext(ThemeContext);

  const insertKnobItems = [{
    label: 'Artboard',
    icon: 'artboard',
    onSelection: toggleArtboardToolThunk
  },{
    label: 'Rectangle',
    icon: 'rectangle',
    onSelection: () => toggleShapeToolThunk('Rectangle')
  },{
    label: 'Rounded',
    icon: 'rounded',
    onSelection: () => toggleShapeToolThunk('Rounded')
  },{
    label: 'Ellipse',
    icon: 'ellipse',
    onSelection: () => toggleShapeToolThunk('Ellipse')
  },{
    label: 'Star',
    icon: 'star',
    onSelection: () => toggleShapeToolThunk('Star')
  },{
    label: 'Polygon',
    icon: 'polygon',
    onSelection: () => toggleShapeToolThunk('Polygon')
  },{
    label: 'Line',
    icon: 'line',
    onSelection: () => toggleShapeToolThunk('Line')
  },{
    label: 'Text',
    icon: 'text',
    onSelection: toggleTextToolThunk
  },{
    label: 'Image',
    icon: 'image',
    onSelection: (): void => {
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
  activeIndex: number;
} => {
  const { insertKnob } = state;
  const activeIndex = insertKnob.index;
  return { activeIndex };
};

export default connect(
  mapStateToProps,
  {
    toggleShapeToolThunk,
    toggleArtboardToolThunk,
    toggleTextToolThunk,
    addImageThunk,
    activateInsertKnob,
    deactivateInsertKnob,
    setInsertKnobIndex
  }
)(InsertKnob);