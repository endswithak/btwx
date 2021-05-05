/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { setCanvasMeasuring } from '../store/actions/canvasSettings';
import { deselectAllLayers, deselectAllLayerEvents, deselectAllLayerEventTweens } from '../store/actions/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { closeGradientEditor } from '../store/actions/gradientEditor';
import { closeColorEditor } from '../store/actions/colorEditor';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { closeFontFamilySelector } from '../store/actions/fontFamilySelector';

const KeyBindings = (): ReactElement => {
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
  const dispatch = useDispatch();
  const activeInput = (document.activeElement && document.activeElement.nodeName === 'INPUT');
  const [hasActiveInupt, setHasActiveInput] = useState((document.activeElement && document.activeElement.nodeName === 'INPUT'));

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Alt') {
      dispatch(setCanvasMeasuring({
        measuring: true
      }));
    }
    if (e.key === 'Escape' && !escapeDisabled) {
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

  const handleKeyUp = (e: any): void => {
    if (e.key === 'Alt') {
      if (measuring) {
        dispatch(setCanvasMeasuring({
          measuring: false
        }));
      }
    } else {
      if (measuring) {
        dispatch(setCanvasMeasuring({
          measuring: false
        }));
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
    artboardPresetEditorOpen, fontFamilySelectorOpen, escapeDisabled, hasActiveInupt
  ]);

  useEffect(() => {
    setHasActiveInput(activeInput);
  }, [activeInput]);

  return null;
}

export default KeyBindings;