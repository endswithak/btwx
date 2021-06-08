/* eslint-disable @typescript-eslint/no-use-before-define */
// import { ipcRenderer } from 'electron';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getSelectedLeft, getSelectedCenter, getSelectedRight, getSelectedTop, getSelectedMiddle, getSelectedBottom, canSendSelectedBackward, canBringSelectedForward, canGroupSelected, canUngroupSelected } from '../store/selectors/layer';

const Touchbar = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const recording = useSelector((state: RootState) => state.preview.recording);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  // zoom
  const canZoomOut = useSelector((state: RootState) => state.documentSettings.zoom !== 0.01);
  // insert
  const isArtboardToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const isShapeToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape');
  const isRectangleToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
  const isEllipseToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Ellipse');
  const isTextToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const hasActiveArtboard: boolean = useSelector((state: RootState) => state.layer.present.activeArtboard !== null);
  // align distribute
  const canAlignLeft = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedLeft(state) === 'multi'));
  const canAlignCenter = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedCenter(state) === 'multi'));
  const canAlignRight = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedRight(state) === 'multi'));
  const canAlignTop = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedTop(state) === 'multi'));
  const canAlignMiddle = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedMiddle(state) === 'multi'));
  const canAlignBottom = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedBottom(state) === 'multi'));
  const canDistribute = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 3);
  // move
  const canSendBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
  const canBringForward = useSelector((state: RootState) => canBringSelectedForward(state));
  // group
  const canGroup = useSelector((state: RootState) => canGroupSelected(state) && state.canvasSettings.focusing);
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  //
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const isMac = useSelector((state: RootState) => state.session.platform === 'darwin');
  const instanceId = useSelector((state: RootState) => state.session.instance);

  useEffect(() => {
    if (ready && isMac && focusing && selected.length === 0 && !recording) {
      (window as any).api.buildEmptySelectionTouchBar(JSON.stringify({
        instanceId,
        isArtboardToolActive,
        theme,
        hasActiveArtboard,
        isRectangleToolActive,
        isEllipseToolActive,
        isTextToolActive,
        canZoomOut
      }));
      // ipcRenderer.send('buildEmptySelectionTouchBar', JSON.stringify({
      //   instanceId,
      //   isArtboardToolActive,
      //   theme,
      //   hasActiveArtboard,
      //   isRectangleToolActive,
      //   isEllipseToolActive,
      //   isTextToolActive,
      //   canZoomOut
      // }));
    }
  }, [
    ready, selected, canZoomOut, focusing, isArtboardToolActive,
    hasActiveArtboard, isRectangleToolActive, isEllipseToolActive,
    isTextToolActive, theme, isShapeToolActive
  ]);

  useEffect(() => {
    if (ready && isMac && focusing && selected.length >= 1 && !recording) {
      (window as any).api.buildSelectionTouchBar(JSON.stringify({
        instanceId,
        canAlignLeft,
        canAlignCenter,
        canAlignRight,
        canAlignTop,
        canAlignMiddle,
        canAlignBottom,
        canDistribute,
        canGroup,
        canUngroup,
        canBringForward,
        canSendBackward
      }));
      // ipcRenderer.send('buildSelectionTouchBar', JSON.stringify({
      //   instanceId,
      //   canAlignLeft,
      //   canAlignCenter,
      //   canAlignRight,
      //   canAlignTop,
      //   canAlignMiddle,
      //   canAlignBottom,
      //   canDistribute,
      //   canGroup,
      //   canUngroup,
      //   canBringForward,
      //   canSendBackward
      // }));
    }
  }, [
    ready, selected, canAlignLeft, canAlignCenter, canAlignRight,
    canAlignTop, canAlignMiddle, canAlignBottom, canDistribute,
    canGroup, canUngroup, canBringForward, canSendBackward
  ]);

  useEffect(() => {
    if (ready && isMac && !focusing && !recording) {
      (window as any).api.clearTouchBar(JSON.stringify({
        instanceId
      }));
      // ipcRenderer.send('clearTouchBar', JSON.stringify({
      //   instanceId
      // }));
    }
  }, [
    ready, focusing
  ]);

  useEffect(() => {
    if (recording) {
      (window as any).api.buildDocumentRecordingTouchBar(JSON.stringify({
        instanceId
      }));
      // ipcRenderer.send('buildDocumentRecordingTouchBar', JSON.stringify({
      //   instanceId
      // }));
    } else {
      if (!focusing) {
        (window as any).api.clearTouchBar(JSON.stringify({
          instanceId
        }));
        // ipcRenderer.send('clearTouchBar', JSON.stringify({
        //   instanceId
        // }));
      } else {
        if (selected.length >= 1) {
          (window as any).api.buildSelectionTouchBar(JSON.stringify({
            instanceId,
            canAlignLeft,
            canAlignCenter,
            canAlignRight,
            canAlignTop,
            canAlignMiddle,
            canAlignBottom,
            canDistribute,
            canGroup,
            canUngroup,
            canBringForward,
            canSendBackward
          }));
          // ipcRenderer.send('buildSelectionTouchBar', JSON.stringify({
          //   instanceId,
          //   canAlignLeft,
          //   canAlignCenter,
          //   canAlignRight,
          //   canAlignTop,
          //   canAlignMiddle,
          //   canAlignBottom,
          //   canDistribute,
          //   canGroup,
          //   canUngroup,
          //   canBringForward,
          //   canSendBackward
          // }));
        } else {
          (window as any).api.buildEmptySelectionTouchBar(JSON.stringify({
            instanceId,
            isArtboardToolActive,
            theme,
            hasActiveArtboard,
            isRectangleToolActive,
            isEllipseToolActive,
            isTextToolActive,
            canZoomOut
          }));
          // ipcRenderer.send('buildEmptySelectionTouchBar', JSON.stringify({
          //   instanceId,
          //   isArtboardToolActive,
          //   theme,
          //   hasActiveArtboard,
          //   isRectangleToolActive,
          //   isEllipseToolActive,
          //   isTextToolActive,
          //   canZoomOut
          // }));
        }
      }
    }
  }, [
    recording
  ]);

  return null;
}

export default Touchbar;