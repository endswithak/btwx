/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import Tooltip from '../canvas/tooltip';
import { getLayerProjectIndices } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { addShapeThunk } from '../store/actions/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const ShapeTool = (props: PaperToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
  const isEnabled = useSelector((state: RootState) => state.shapeTool.isEnabled);
  const shapeType = useSelector((state: RootState) => state.shapeTool.shapeType);
  // const scope = useSelector((state: RootState) => state.layer.present.scope);
  // const activeProjectIndex = useSelector((state: RootState) => state.layer.present.activeProjectIndex);
  const drawing = useSelector((state: RootState) => state.canvasSettings.drawing);
  const layerProjectIndices = useSelector((state: RootState) => getLayerProjectIndices(state));
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const activeArtboardPaperScope = useSelector((state: RootState) => activeArtboard ? (state.layer.present.byId[state.layer.present.activeArtboard] as Btwx.Artboard).projectIndex : null);
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
  const dispatch = useDispatch();

  const resetState = () => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = paperMain.projects[0].getItem({ data: { id: 'tooltips' }});
    drawingPreview.removeChildren();
    tooltips.removeChildren();
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
    if (drawing) {
      dispatch(setCanvasDrawing({ drawing: false }));
    }
  }

  const renderShape = (shapeOpts: any) => {
    const fromPoint = from ? from : dragEvent.downPoint;
    switch(shapeType) {
      case 'Rectangle':
        return new paperMain.Path.Rectangle({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Ellipse':
        return new paperMain.Path.Ellipse({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Rounded':
        return new paperMain.Path.Rectangle({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          radius: (maxDim / 2) * DEFAULT_ROUNDED_RADIUS,
          ...shapeOpts
        });
      case 'Polygon': {
        const shape = new paperMain.Path.RegularPolygon({
          center: new paperMain.Point(0, 0),
          radius: maxDim / 2,
          sides: DEFAULT_POLYGON_SIDES,
          ...shapeOpts
        });
        shape.bounds.width = toBounds.width;
        shape.bounds.height = toBounds.height;
        shape.position = toBounds.center;
        return shape;
      }
      case 'Star': {
        const shape = new paperMain.Path.Star({
          center: new paperMain.Point(0, 0),
          radius1: maxDim / 2,
          radius2: (maxDim / 2) * DEFAULT_STAR_RADIUS,
          points: DEFAULT_STAR_POINTS,
          ...shapeOpts
        });
        shape.bounds.width = toBounds.width;
        shape.bounds.height = toBounds.height;
        shape.position = toBounds.center;
        return shape;
      }
      case 'Line': {
        const isHorizontal = isBetween(vector.angle, 0, 45) || isBetween(vector.angle, -45, 0) || isBetween(vector.angle, 135, 180) || isBetween(vector.angle, -180, -135);
        const isVertical = isBetween(vector.angle, -90, -45) || isBetween(vector.angle, -135, -90) || isBetween(vector.angle, 45, 90) || isBetween(vector.angle, 90, 135);
        const lineTo = (() => {
          if (shiftModifier) {
            if (isHorizontal) {
              return new paperMain.Point(toBounds[handle].x, fromPoint.y);
            } else if (isVertical) {
              return new paperMain.Point(fromPoint.x, toBounds[handle].y);
            } else {
              return toBounds[handle];
            }
          } else {
            return toBounds[handle];
          }
        })();
        const shape = new paperMain.Path.Line({
          from: fromPoint,
          to: lineTo.round(),
          ...shapeOpts
        });
        if (shiftModifier) {
          if (isVertical) {
            toBounds.width = 1;
          }
          if (isHorizontal) {
            toBounds.height = 1;
          }
        } else {
          shape.bounds.width = toBounds.width;
          shape.bounds.height = toBounds.height;
          shape.position = toBounds.center;
        }
        return shape;
      }
    }
  }

  const updatePreview = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = paperMain.projects[0].getItem({ data: { id: 'tooltips' }});
    drawingPreview.removeChildren();
    tooltips.removeChildren();
    const nextTooltip = new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, dragEvent.point, {up: true});
    const nextPreview = renderShape({
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      parent: drawingPreview
    });
    nextPreview.removeOn({
      up: true
    });
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
    try {
      if (moveEvent && isEnabled && !drawing) {
        const nextSnapBounds = new paperMain.Rectangle({
          from: new paperMain.Point(moveEvent.point.x - 0.5, moveEvent.point.y - 0.5),
          to: new paperMain.Point(moveEvent.point.x + 0.5, moveEvent.point.y + 0.5)
        });
        setSnapBounds(nextSnapBounds);
      }
    } catch(err) {
      console.error(`Shape Tool Error -- On Mouse Move -- ${err}`);
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
          setFrom(initialToBounds.center.round());
        } else {
          setFrom(downEvent.point.round());
        }
      }
    } catch(err) {
      console.error(`Shape Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent])

  useEffect(() => {
    try {
      if (from && dragEvent && isEnabled) {
        const dragPoint = dragEvent.point.round();
        const nextVector = dragPoint.subtract(from);
        const nextHandle = `${nextVector.y > 0 ? 'bottom' : 'top'}${nextVector.x > 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
        const nextDims = new paperMain.Rectangle({from: from, to: dragPoint}).size;
        const nextMaxDim = Math.max(nextDims.width, nextDims.height);
        const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? from.x - nextMaxDim : from.x + nextMaxDim, nextVector.y < 0 ? from.y - nextMaxDim : from.y + nextMaxDim).round();
        const nextSnapBounds = new paperMain.Rectangle({
          from: from,
          to: dragEvent.modifiers.shift ? nextContrainedDims : dragPoint
        });
        setHandle(nextHandle);
        setVector(nextVector);
        setDims(nextDims);
        setMaxDim(nextMaxDim);
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
      console.error(`Shape Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (from && upEvent && isEnabled && drawing && toBounds && toBounds.width >= 1 && toBounds.height >= 1) {
        const paperLayer = renderShape({ insert: false });
        const lineFromPoint = (paperLayer as paper.Path).firstSegment.point;
        const lineToPoint = (paperLayer as paper.Path).lastSegment.point;
        const lineVector = lineToPoint.subtract(lineFromPoint);
        const parentItem = layerProjectIndices.reduce((result, current, index) => {
          const projectIndex = paperMain.projects[current];
          if (projectIndex) {
            const hitTest = projectIndex.getItem({
              data: (data: any) => {
                return data.id === 'artboardBackground';
              },
              overlapping: paperLayer.bounds
            });
            return hitTest ? {
              id: hitTest.parent.data.id,
              projectIndex: index + 1,
              paperLayer: hitTest.parent
            } : result;
          } else {
            return result;
          }
        }, {
          id: activeArtboard,
          projectIndex: activeArtboardPaperScope,
          paperLayer: paperMain.projects[activeArtboardPaperScope].getItem({ data: { id: activeArtboard } })
        });
        dispatch(addShapeThunk({
          layer: {
            parent: parentItem.id,
            name: shapeType,
            frame: {
              x: paperLayer.position.x - parentItem.paperLayer.position.x,
              y: paperLayer.position.y - parentItem.paperLayer.position.y,
              width: paperLayer.bounds.width,
              height: paperLayer.bounds.height,
              innerWidth: shapeType === 'Line' ? Math.round(lineVector.length) : paperLayer.bounds.width,
              innerHeight: shapeType === 'Line' ? 0 : paperLayer.bounds.height
            },
            shapeType: shapeType,
            style: {
              ...DEFAULT_STYLE,
              fill: {
                ...DEFAULT_STYLE.fill,
                enabled: shapeType !== 'Line'
              }
            },
            transform: {
              ...DEFAULT_TRANSFORM,
              rotation: shapeType === 'Line' ? lineVector.angle : DEFAULT_TRANSFORM.rotation
            },
            closed: shapeType !== 'Line',
            pathData: paperLayer.pathData,
            ...(() => {
              switch(shapeType) {
                case 'Ellipse':
                case 'Rectangle':
                  return {};
                case 'Rounded':
                  return {
                    radius: DEFAULT_ROUNDED_RADIUS
                  };
                case 'Star':
                  return {
                    points: DEFAULT_STAR_POINTS,
                    radius: DEFAULT_STAR_RADIUS
                  }
                case 'Polygon':
                  return {
                    sides: DEFAULT_STAR_POINTS
                  }
                case 'Line': {
                  return {
                    from: {
                      x: lineFromPoint.x - parentItem.paperLayer.position.x,
                      y: lineFromPoint.y - parentItem.paperLayer.position.y
                    },
                    to: {
                      x: lineToPoint.x - parentItem.paperLayer.position.x,
                      y: lineToPoint.y - parentItem.paperLayer.position.y
                    }
                  }
                }
                default:
                  return {};
              }
            })()
          }
        })) as any;
        dispatch(toggleShapeToolThunk(shapeType));
        resetState();
      } else {
        setFrom(null);
      }
    } catch(err) {
      console.error(`Shape Tool Error -- On Mouse Up -- ${err}`);
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
      console.error(`Shape Tool Error -- On Key Down -- ${err}`);
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
      console.error(`Shape Tool Error -- On Key Up -- ${err}`);
      resetState();
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
        snapRule={drawing ? 'resize' : 'move'}
        hitTestZones={getSnapToolHitTestZones()}
        preserveAspectRatio={shiftModifier}
        aspectRatio={1}
        onUpdate={handleSnapToolUpdate}
        toolEvent={drawing ? dragEvent : moveEvent}
        whiteListLayers={[activeArtboard]}
        resizeHandle={handle} />
    : null
  );
}

export default PaperTool(
  ShapeTool,
  { all: true }
);