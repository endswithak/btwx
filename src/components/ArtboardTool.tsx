/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Tooltip from '../canvas/tooltip';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDrawingPayload } from '../store/actionTypes/canvasSettings';
import { addArtboardThunk } from '../store/actions/layer';
import { LayerTypes, AddArtboardPayload } from '../store/actionTypes/layer';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';

interface ArtboardToolProps {
  isEnabled?: boolean;
  drawing?: boolean;
  addArtboardThunk?(payload: AddArtboardPayload): void;
  setCanvasDrawing?(payload: SetCanvasDrawingPayload): CanvasSettingsTypes;
  toggleArtboardToolThunk?(): void;
}

const ArtboardTool = (props: ArtboardToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, addArtboardThunk, setCanvasDrawing, drawing, toggleArtboardToolThunk } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [constrainedDims, setConstrainedDims] = useState<paper.Point>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);

  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);

  const [moveEvent, setMoveEvent] = useState<paper.ToolEvent>(null);

  const [fromEvent, setFromEvent] = useState<paper.ToolEvent>(null);
  const [from, setFrom] = useState<paper.Point>(null);

  const [toEvent, setToEvent] = useState<paper.ToolEvent>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [initialToBounds, setInitialToBounds] = useState<paper.Rectangle>(null);

  const [endEvent, setEndEvent] = useState<paper.ToolEvent>(null);

  const [keyDownEvent, setKeyDownEvent] = useState<paper.KeyEvent>(null);
  const [keyUpEvent, setKeyUpEvent] = useState<paper.KeyEvent>(null);

  const resetState = () => {
    if (getPaperLayer('Tooltip')) {
      getPaperLayer('Tooltip').remove();
    }
    if (getPaperLayer('ArtboardToolPreview')) {
      getPaperLayer('ArtboardToolPreview').remove();
    }
    setFrom(null);
    setFromEvent(null);
    setToEvent(null);
    setEndEvent(null);
    setHandle(null);
    setConstrainedDims(null);
    setToBounds(null);
    setShiftModifier(false);
    setSnapBounds(null);
    setKeyDownEvent(null);
    setKeyUpEvent(null);
    setInitialToBounds(null);
  }

  const updatePreview = (): void => {
    if (getPaperLayer('ArtboardToolPreview')) {
      getPaperLayer('ArtboardToolPreview').remove();
    }
    if (getPaperLayer('Tooltip')) {
      getPaperLayer('Tooltip').remove();
    }
    const nextTooltip = new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, toEvent.point, {up: true});
    const nextPreview = new paperMain.Path.Rectangle({
      rectangle: toBounds,
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'ArtboardToolPreview'
      }
    });
    nextPreview.removeOn({
      up: true
    });
  }

  const handleKeyDown = (e: paper.KeyEvent): void => {
    setKeyDownEvent(e);
  }

  const handleKeyUp = (e: paper.KeyEvent): void => {
    setKeyUpEvent(e);
  }

  const handleMouseMove = (e: paper.ToolEvent): void => {
    setMoveEvent(e);
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    setFromEvent(e);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    setToEvent(e);
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    setEndEvent(e);
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
    if (fromEvent && isEnabled) {
      if (initialToBounds) {
        setFrom(initialToBounds.center);
      } else {
        setFrom(fromEvent.point);
      }
    }
  }, [fromEvent])

  useEffect(() => {
    if (toEvent && isEnabled) {
      const fromPoint = from ? from : toEvent.downPoint;
      const x = toEvent.point.x - fromPoint.x;
      const y = toEvent.point.y - fromPoint.y;
      const nextHandle = `${y > 0 ? 'bottom' : 'top'}${x > 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
      const nextVector = toEvent.point.subtract(fromPoint);
      const nextDims = new paperMain.Rectangle({from: fromPoint, to: toEvent.point}).size;
      const nextMaxDim = Math.max(nextDims.width, nextDims.height);
      const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? fromPoint.x - nextMaxDim : fromPoint.x + nextMaxDim, nextVector.y < 0 ? fromPoint.y - nextMaxDim : fromPoint.y + nextMaxDim);
      const nextSnapBounds = new paperMain.Rectangle({
        from: fromPoint,
        to: toEvent.modifiers.shift ? nextContrainedDims : toEvent.point
      });
      setHandle(nextHandle);
      setConstrainedDims(nextContrainedDims);
      setSnapBounds(nextSnapBounds);
      if (!drawing) {
        setCanvasDrawing({drawing: true});
      }
      if (toEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
      if (!toEvent.modifiers.shift && shiftModifier) {
        setShiftModifier(false);
      }
    }
  }, [toEvent]);

  useEffect(() => {
    if (endEvent && isEnabled && drawing) {
      addArtboardThunk({
        layer: {
          parent: 'page',
          frame: {
            x: toBounds.center.x,
            y: toBounds.center.y,
            width: toBounds.width,
            height: toBounds.height,
            innerWidth: toBounds.width,
            innerHeight: toBounds.height
          }
        }
      }) as any;
      toggleArtboardToolThunk();
      resetState();
    }
  }, [endEvent]);

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
          to: toEvent.point
        }));
        setShiftModifier(false);
      }
    }
  }, [keyUpEvent]);

  // handle preview on toBounds update
  useEffect(() => {
    if (toBounds && isEnabled) {
      updatePreview();
    }
  }, [toBounds]);

  // handle tool enable / disable
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

  // handle initial tool setup
  useEffect(() => {
    const artboardTool = new paperMain.Tool();
    artboardTool.minDistance = 1;
    artboardTool.onKeyDown = handleKeyDown;
    artboardTool.onKeyUp = handleKeyUp;
    artboardTool.onMouseMove = handleMouseMove;
    artboardTool.onMouseDown = handleMouseDown;
    artboardTool.onMouseDrag = handleMouseDrag;
    artboardTool.onMouseUp = handleMouseUp;
    setTool(artboardTool);
    paperMain.tool = null;
  }, []);

  return (
    isEnabled
    ? <SnapTool
        bounds={snapBounds}
        snapRule={drawing ? 'resize' : 'move'}
        hitTestZones={drawing ? (() => {
          const x = toEvent ? toEvent.point.x - toEvent.downPoint.x : 0;
          const y = toEvent ? toEvent.point.y - toEvent.downPoint.y : 0;
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
        })() : { center: true, middle: true }}
        preserveAspectRatio={shiftModifier}
        aspectRatio={1}
        onUpdate={drawing ? setToBounds : setInitialToBounds}
        toolEvent={drawing ? toEvent : moveEvent}
        resizeHandle={handle} />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  drawing: boolean;
} => {
  const { canvasSettings, artboardTool } = state;
  const isEnabled = artboardTool.isEnabled;
  const drawing = canvasSettings.drawing;
  return {
    isEnabled,
    drawing
  };
};

export default connect(
  mapStateToProps,
  { addArtboardThunk, setCanvasDrawing, toggleArtboardToolThunk }
)(ArtboardTool);