/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedBounds } from '../store/selectors/layer';
import { setCanvasMeasuring } from '../store/actions/canvasSettings';
import { deselectAllLayers, deselectAllLayerEvents, deselectAllLayerEventTweens, moveLayersBy } from '../store/actions/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { closeColorEditor } from '../store/actions/colorEditor';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import SnapTool from './SnapTool';

const KeyBindings = (): ReactElement => {
  const selectedLayers = useSelector((state: RootState) => state.layer.present.selected);
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const escapeDisabled = useSelector((state: RootState) => state.canvasSettings.selecting || state.canvasSettings.dragging || state.canvasSettings.resizing || state.canvasSettings.drawing);
  const measuring = useSelector((state: RootState) => state.canvasSettings.measuring);
  const gradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const colorEditorOpen = useSelector((state: RootState) => state.colorEditor.isOpen);
  const easeEditorOpen = useSelector((state: RootState) => state.easeEditor.isOpen);
  const artboardPresetEditorOpen = useSelector((state: RootState) => state.artboardPresetEditor.isOpen);
  const fontFamilySelectorOpen = useSelector((state: RootState) => state.fontFamilySelector.isOpen);
  const shapeToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape');
  const shapeToolShapeType = useSelector((state: RootState) => state.shapeTool.shapeType);
  const textToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const artboardToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const activeInput = (document.activeElement && (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA'));
  const [hasActiveInupt, setHasActiveInput] = useState(activeInput);
  const [nudging, setNudging] = useState(false);
  const [nudgeEvent, setNudgeEvent] = useState(null);
  const dispatch = useDispatch();

  const nudgeTimeout = useCallback(debounce(() => {
    setNudging(false);
  }, 250), []);

  const handleNudge = (direction: 'up' | 'down' | 'left' | 'right'): void => {
    if (!hasActiveInupt && focusing && selectedLayers.length > 0) {
      let deltaX;
      let deltaY;
      switch(direction) {
        case 'up':
          deltaX = 0;
          deltaY = -1;
          break;
        case 'down':
          deltaX = 0;
          deltaY = 1;
          break;
        case 'left':
          deltaX = -1;
          deltaY = 0;
          break;
        case 'right':
          deltaX = 1;
          deltaY = 0;
          break;
      }
      dispatch(moveLayersBy({
        layers: selectedLayers,
        x: deltaX,
        y: deltaY
      }));
      if (!nudging) {
        setNudging(true);
      }
      nudgeTimeout();
      setNudgeEvent({
        delta: {
          x: deltaX,
          y: deltaY
        }
      });
    }
  }

  const handleEscape = (): void => {
    if (!escapeDisabled) {
      if (hasActiveInupt) {
        (document.activeElement as HTMLInputElement).blur();
        setHasActiveInput(false);
      } else {
        if (artboardPresetEditorOpen || easeEditorOpen) {
          if (artboardPresetEditorOpen) {
            dispatch(closeArtboardPresetEditor());
          }
          if (easeEditorOpen) {
            dispatch(closeEaseEditor());
          }
        } else {
          if (gradientEditorOpen || colorEditorOpen || fontFamilySelectorOpen) {
            if (gradientEditorOpen) {
              dispatch(closeGradientEditor());
            }
            if (colorEditorOpen) {
              dispatch(closeColorEditor());
            }
            if (fontFamilySelectorOpen) {
              dispatch(closeFontFamilySelector());
            }
          } else {
            if (shapeToolActive || artboardToolActive || textToolActive) {
              if (shapeToolActive) {
                dispatch(toggleShapeToolThunk(shapeToolShapeType));
              }
              if (artboardToolActive) {
                dispatch(toggleArtboardToolThunk());
              }
              if (textToolActive) {
                dispatch(toggleTextToolThunk());
              }
            } else {
              dispatch(deselectAllLayers());
              dispatch(deselectAllLayerEvents());
              dispatch(deselectAllLayerEventTweens());
            }
          }
        }
      }
    }
  }

  const handleKeyDown = (e: any): void => {
    switch(e.key) {
      case 'ArrowUp':
        handleNudge('up');
        break;
      case 'ArrowDown':
        handleNudge('down');
        break;
      case 'ArrowLeft':
        handleNudge('left');
        break;
      case 'ArrowRight':
        handleNudge('right');
        break;
      case 'Alt':
        dispatch(setCanvasMeasuring({
          measuring: true
        }));
        break;
      case 'Escape':
        handleEscape();
        break;
    }
  }

  const handleKeyUp = (e: any): void => {
    switch(e.key) {
      case 'Alt': {
        if (measuring) {
          dispatch(setCanvasMeasuring({
            measuring: false
          }));
        }
        break;
      }
      default: {
        if (measuring) {
          dispatch(setCanvasMeasuring({
            measuring: false
          }));
        }
        break;
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [
    focusing, measuring, gradientEditorOpen, colorEditorOpen, easeEditorOpen,
    shapeToolActive, shapeToolShapeType, artboardToolActive, textToolActive,
    artboardPresetEditorOpen, fontFamilySelectorOpen, escapeDisabled, hasActiveInupt,
    selectedLayers, selectedBounds, nudging, nudgeEvent
  ]);

  useEffect(() => {
    setHasActiveInput(activeInput);
  }, [activeInput]);

  return (
    nudging
    ? <SnapTool
        bounds={selectedBounds}
        snapRule='move'
        hitTestZones={{all: true}}
        onUpdate={() => { return; }}
        toolEvent={nudgeEvent}
        blackListLayers={selectedLayers}
        noSnapZoneScale
        measure />
    : null
  );
}

export default KeyBindings;