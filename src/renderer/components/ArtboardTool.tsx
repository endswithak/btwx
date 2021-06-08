/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { addArtboardThunk } from '../store/actions/layer';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { ThemeContext } from './ThemeProvider';
import Tooltip from '../canvas/tooltip';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const ArtboardTool = (props: PaperToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const isEnabled = useSelector((state: RootState) => state.artboardTool.isEnabled);
  const drawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [constrainedDims, setConstrainedDims] = useState<paper.Point>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [from, setFrom] = useState<paper.Point>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [initialToBounds, setInitialToBounds] = useState<paper.Rectangle>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = paperMain.projects[0].getItem({ data: { id: 'tooltips' }});
    drawingPreview.removeChildren();
    tooltips.removeChildren();
    setFrom(null);
    setHandle(null);
    setConstrainedDims(null);
    setToBounds(null);
    setShiftModifier(false);
    setSnapBounds(null);
    setInitialToBounds(null);
    if (drawing) {
      dispatch(setCanvasDrawing({ drawing: false }));
    }
  }

  const updatePreview = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = paperMain.projects[0].getItem({ data: { id: 'tooltips' }});
    drawingPreview.removeChildren();
    tooltips.removeChildren();
    new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, dragEvent.point, {up: true});
    new paperMain.Path.Rectangle({
      rectangle: toBounds,
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      parent: drawingPreview
    }).removeOn({
      up: true
    });
  }

  const getSnapToolHitTestZones = (): {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    center?: boolean;
    middle?: boolean;
  } => {
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
    try {
      if (moveEvent && isEnabled && !drawing) {
        const nextSnapBounds = new paperMain.Rectangle({
          from: new paperMain.Point(moveEvent.point.x - 0.5, moveEvent.point.y - 0.5),
          to: new paperMain.Point(moveEvent.point.x + 0.5, moveEvent.point.y + 0.5)
        });
        setSnapBounds(nextSnapBounds);
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Mouse Move -- ${err}`);
      resetState();
    }
  }, [moveEvent])

  useEffect(() => {
    try {
      if (downEvent && isEnabled) {
        if (paperMain.project.activeLayer.data.id !== 'ui') {
          paperMain.projects[0].activate();
        }
        if (initialToBounds) {
          setFrom(initialToBounds.center);
        } else {
          setFrom(downEvent.point);
        }
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent])

  useEffect(() => {
    try {
      if (from && dragEvent && isEnabled) {
        const x = dragEvent.point.x - from.x;
        const y = dragEvent.point.y - from.y;
        const nextHandle = `${y > 0 ? 'bottom' : 'top'}${x > 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
        const nextVector = dragEvent.point.subtract(from);
        const nextDims = new paperMain.Rectangle({from: from, to: dragEvent.point}).size;
        const nextMaxDim = Math.max(nextDims.width, nextDims.height);
        const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? from.x - nextMaxDim : from.x + nextMaxDim, nextVector.y < 0 ? from.y - nextMaxDim : from.y + nextMaxDim);
        const nextSnapBounds = new paperMain.Rectangle({
          from: from,
          to: dragEvent.modifiers.shift ? nextContrainedDims : dragEvent.point
        });
        setHandle(nextHandle);
        setConstrainedDims(nextContrainedDims);
        if (nextSnapBounds.width >= 1 && nextSnapBounds.height >= 1) {
          setSnapBounds(nextSnapBounds);
          if (!drawing) {
            dispatch(setCanvasDrawing({drawing: true}));
          }
        }
        if (dragEvent.modifiers.shift && !shiftModifier) {
          setShiftModifier(true);
        }
        if (!dragEvent.modifiers.shift && shiftModifier) {
          setShiftModifier(false);
        }
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (upEvent && isEnabled && drawing && toBounds && toBounds.width >= 1 && toBounds.height >= 1) {
        dispatch(addArtboardThunk({
          layer: {
            frame: {
              x: toBounds.center.x,
              y: toBounds.center.y,
              width: toBounds.width,
              height: toBounds.height,
              innerWidth: toBounds.width,
              innerHeight: toBounds.height
            }
          }
        })) as any;
        dispatch(toggleArtboardToolThunk());
        resetState();
      } else {
        setFrom(null);
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && drawing) {
        if (keyDownEvent.key === 'shift') {
          setSnapBounds(new paperMain.Rectangle({
            from: from,
            to: constrainedDims
          }));
          setShiftModifier(true);
        }
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Key Down -- ${err}`);
      resetState();
    }
  }, [keyDownEvent]);

  useEffect(() => {
    try {
      if (keyUpEvent && isEnabled && drawing) {
        if (keyUpEvent.key === 'shift') {
          setSnapBounds(new paperMain.Rectangle({
            from: from,
            to: dragEvent.point
          }));
          setShiftModifier(false);
        }
      }
    } catch(err) {
      console.error(`Artboard Tool Error -- On Key Up -- ${err}`);
      resetState();
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

  return (
    isEnabled
    ? <SnapTool
        bounds={snapBounds}
        snapRule={drawing ? 'resize' : 'move'}
        hitTestZones={getSnapToolHitTestZones()}
        preserveAspectRatio={shiftModifier}
        aspectRatio={1}
        onUpdate={handleSnapToolUpdate}
        toolEvent={drawing ? dragEvent : moveEvent}
        // blackListLayers={[activeArtboard]}
        resizeHandle={handle} />
    : null
  );
}

export default PaperTool(
  ArtboardTool,
  { all: true }
);