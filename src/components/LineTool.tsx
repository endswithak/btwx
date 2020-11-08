/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import Tooltip from '../canvas/tooltip';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDrawingPayload } from '../store/actionTypes/canvasSettings';
import { setLineFrom, setLineTo } from '../store/actions/layer';
import { SetLineFromPayload, SetLineToPayload, LayerTypes } from '../store/actionTypes/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface LineToolStateProps {
  isEnabled?: boolean;
  scope?: string[];
  resizing?: boolean;
  initialHandle?: Btwx.LineHandle | Btwx.ResizeHandle;
}

interface LineToolDispatchProps {
  setLineFrom?(payload: SetLineFromPayload): LayerTypes;
  setLineTo?(payload: SetLineToPayload): LayerTypes;
}

type LineToolProps = (
  LineToolStateProps &
  LineToolDispatchProps &
  PaperToolProps
);

const LineTool = (props: LineToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, scope, resizing, initialHandle, setLineFrom, setLineTo, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [maxDim, setMaxDim] = useState<number>(null);
  const [vector, setVector] = useState<paper.Point>(null);
  const [dims, setDims] = useState<paper.Size>(null);
  const [constrainedDims, setConstrainedDims] = useState<paper.Point>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [from, setFrom] = useState<paper.Point>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [initialToBounds, setInitialToBounds] = useState<paper.Rectangle>(null);

  const resetState = () => {
    if (getPaperLayer('Tooltip')) {
      getPaperLayer('Tooltip').remove();
    }
    if (getPaperLayer('LineToolPreview')) {
      getPaperLayer('LineToolPreview').remove();
    }
    setFrom(null);
    setHandle(null);
    setVector(null);
    setDims(null);
    setMaxDim(null);
    setConstrainedDims(null);
    setToBounds(null);
    setShiftModifier(false);
    setSnapBounds(null);
    setInitialToBounds(null);
  }

  const getSnapToolHitTestZones = () => {
    if (drawing) {
      const x = dragEvent ? dragEvent.point.x - dragEvent.downPoint.x : 0;
      const y = dragEvent ? dragEvent.point.y - dragEvent.downPoint.y : 0;
      switch(handle) {
        case 'topCenter':
          return { top: true };
        case 'bottomCenter':
          return { bottom: true };
        case 'leftCenter':
          return { left: true };
        case 'rightCenter':
          return { right: true };
        case 'topLeft':
          if (dragEvent && dragEvent.modifiers.shift) {
            if (snapBounds.width > snapBounds.height) {
              return { left: true };
            } else if (snapBounds.width < snapBounds.height) {
              return { top: true };
            } else {
              if (Math.abs(x) > Math.abs(y)) {
                return { left: true };
              } else if (Math.abs(x) < Math.abs(y)) {
                return { top: true };
              } else {
                return { top: true, left: true };
              }
            }
          } else {
            return { top: true, left: true };
          }
        case 'topRight':
          if (dragEvent && dragEvent.modifiers.shift) {
            if (snapBounds.width > snapBounds.height) {
              return { right: true };
            } else if (snapBounds.width < snapBounds.height) {
              return { top: true };
            } else {
              if (Math.abs(x) > Math.abs(y)) {
                return { right: true };
              } else if (Math.abs(x) < Math.abs(y)) {
                return { top: true };
              } else {
                return { top: true, right: true };
              }
            }
          } else {
            return { top: true, right: true };
          }
        case 'bottomLeft':
          if (dragEvent && dragEvent.modifiers.shift) {
            if (snapBounds.width > snapBounds.height) {
              return { left: true };
            } else if (snapBounds.width < snapBounds.height) {
              return { bottom: true };
            } else {
              if (Math.abs(x) > Math.abs(y)) {
                return { left: true };
              } else if (Math.abs(x) < Math.abs(y)) {
                return { bottom: true };
              } else {
                return { bottom: true, left: true };
              }
            }
          } else {
            return { bottom: true, left: true };
          }
        case 'bottomRight':
          if (dragEvent && dragEvent.modifiers.shift) {
            if (snapBounds.width > snapBounds.height) {
              return { right: true };
            } else if (snapBounds.width < snapBounds.height) {
              return { bottom: true };
            } else {
              if (Math.abs(x) > Math.abs(y)) {
                return { right: true };
              } else if (Math.abs(x) < Math.abs(y)) {
                return { bottom: true };
              } else {
                return { bottom: true, right: true };
              }
            }
          } else {
            return { bottom: true, right: true };
          }
      }
    } else {
      return { center: true, middle: true };
    }
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    if (drawing) {
      setToBounds(snapToolBounds);
    } else {
      setInitialToBounds(snapToolBounds);
    }
  }

  useEffect(() => {
    if (moveEvent && isEnabled && !drawing) {
      const nextSnapBounds = new paperMain.Rectangle({
        point: moveEvent.point,
        size: new paperMain.Size(1, 1)
      });
      setSnapBounds(nextSnapBounds);
    }
  }, [moveEvent])

  useEffect(() => {
    if (downEvent && isEnabled) {
      switch(initialHandle) {
        case 'from':
        case 'to':
      }
    }
  }, [downEvent])

  useEffect(() => {
    if (dragEvent && isEnabled) {
      const fromPoint = from ? from : dragEvent.downPoint;
      const x = dragEvent.point.x - fromPoint.x;
      const y = dragEvent.point.y - fromPoint.y;
      const nextHandle = `${y > 0 ? 'bottom' : 'top'}${x > 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
      const nextVector = dragEvent.point.subtract(fromPoint);
      const nextDims = new paperMain.Rectangle({from: fromPoint, to: dragEvent.point}).size;
      const nextMaxDim = Math.max(nextDims.width, nextDims.height);
      const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? fromPoint.x - nextMaxDim : fromPoint.x + nextMaxDim, nextVector.y < 0 ? fromPoint.y - nextMaxDim : fromPoint.y + nextMaxDim);
      const nextSnapBounds = new paperMain.Rectangle({
        from: fromPoint,
        to: dragEvent.modifiers.shift ? nextContrainedDims : dragEvent.point
      });
      setHandle(nextHandle);
      setVector(nextVector);
      setDims(nextDims);
      setMaxDim(nextMaxDim);
      setConstrainedDims(nextContrainedDims);
      setSnapBounds(nextSnapBounds);
      if (dragEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
      if (!dragEvent.modifiers.shift && shiftModifier) {
        setShiftModifier(false);
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled && drawing) {

    }
  }, [upEvent]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && drawing) {
      if (keyDownEvent.key === 'shift') {
        setSnapBounds(new paperMain.Rectangle({
          from: from,
          to: constrainedDims
        }));
        setShiftModifier(true);
      }
    }
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && drawing) {
      if (keyUpEvent.key === 'shift') {
        setSnapBounds(new paperMain.Rectangle({
          from: from,
          to: dragEvent.point
        }));
        setShiftModifier(false);
      }
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      updatePreview();
    }
  }, [toBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
        resetState();
      }
    }
  }, [isEnabled]);

  return (
    isEnabled
    ? <SnapTool
        bounds={snapBounds}
        snapRule={'resize'}
        hitTestZones={getSnapToolHitTestZones()}
        preserveAspectRatio={shiftModifier}
        aspectRatio={1}
        onUpdate={handleSnapToolUpdate}
        toolEvent={drawing ? dragEvent : moveEvent}
        resizeHandle={handle} />
    : null
  );
}

const mapStateToProps = (state: RootState): LineToolStateProps => {
  const { layer, canvasSettings } = state;
  const isEnabled = canvasSettings.activeTool === 'Line';
  const scope = layer.present.scope;
  const resizing = canvasSettings.resizing;
  const initialHandle = canvasSettings.resizeHandle as Btwx.LineHandle | Btwx.ResizeHandle;
  return {
    isEnabled,
    scope,
    resizing,
    initialHandle
  };
};

const mapDispatchToProps = {
  setLineFrom,
  setLineTo
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LineTool)
);