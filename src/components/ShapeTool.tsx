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
import { addShapeThunk } from '../store/actions/layer';
import { LayerTypes, AddShapePayload } from '../store/actionTypes/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';

interface ShapeToolProps {
  isEnabled?: boolean;
  shapeType?: Btwx.ShapeType;
  scope?: string[];
  drawing?: boolean;
  addShapeThunk?(payload: AddShapePayload): void;
  setCanvasDrawing?(payload: SetCanvasDrawingPayload): CanvasSettingsTypes;
  toggleShapeToolThunk?(shapeType: Btwx.ShapeType): void;
}

const ShapeTool = (props: ShapeToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, shapeType, addShapeThunk, scope, setCanvasDrawing, drawing, toggleShapeToolThunk } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [maxDim, setMaxDim] = useState<number>(null);
  const [vector, setVector] = useState<paper.Point>(null);
  const [dims, setDims] = useState<paper.Size>(null);
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
    if (getPaperLayer('ShapeToolPreview')) {
      getPaperLayer('ShapeToolPreview').remove();
    }
    setFrom(null);
    setFromEvent(null);
    setToEvent(null);
    setEndEvent(null);
    setHandle(null);
    setVector(null);
    setDims(null);
    setMaxDim(null);
    setConstrainedDims(null);
    setToBounds(null);
    setShiftModifier(false);
    setSnapBounds(null);
    setKeyDownEvent(null);
    setKeyUpEvent(null);
    setInitialToBounds(null);
  }

  const renderShape = (shapeOpts: any) => {
    const fromPoint = from ? from : toEvent.downPoint;
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
          to: lineTo,
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
    if (getPaperLayer('ShapeToolPreview')) {
      getPaperLayer('ShapeToolPreview').remove();
    }
    if (getPaperLayer('Tooltip')) {
      getPaperLayer('Tooltip').remove();
    }
    const nextTooltip = new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, toEvent.point, {up: true});
    const nextPreview = renderShape({
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'ShapeToolPreview'
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
      setVector(nextVector);
      setDims(nextDims);
      setMaxDim(nextMaxDim);
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
      const paperLayer = renderShape({
        insert: false
      });
      const fromPoint = (paperLayer as paper.Path).firstSegment.point;
      const toPoint = (paperLayer as paper.Path).lastSegment.point;
      const vector = toPoint.subtract(fromPoint);
      addShapeThunk({
        layer: {
          parent: (() => {
            const overlappedArtboard = getPaperLayer('page').getItem({
              data: (data: any) => {
                return data.id === 'ArtboardBackground';
              },
              overlapping: paperLayer.bounds
            });
            return overlappedArtboard && scope[scope.length - 1] === 'page' ? overlappedArtboard.parent.data.id : scope[scope.length - 1];
          })(),
          name: shapeType,
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height,
            innerWidth: shapeType === 'Line' ? vector.length : paperLayer.bounds.width,
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
            rotation: shapeType === 'Line' ? vector.angle : DEFAULT_TRANSFORM.rotation
          },
          pathData: paperLayer.pathData,
          closed: shapeType !== 'Line',
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
              case 'Line':
                return {
                  from: {
                    x: (fromPoint.x - paperLayer.position.x) / vector.length,
                    y: (fromPoint.y - paperLayer.position.y) / vector.length
                  },
                  to: {
                    x: (toPoint.x - paperLayer.position.x) / vector.length,
                    y: (toPoint.y - paperLayer.position.y) / vector.length
                  }
                }
              default:
                return {};
            }
          })()
        }
      }) as any;
      toggleShapeToolThunk(shapeType);
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
    const shapeTool = new paperMain.Tool();
    shapeTool.minDistance = 1;
    shapeTool.onKeyDown = handleKeyDown;
    shapeTool.onKeyUp = handleKeyUp;
    shapeTool.onMouseMove = handleMouseMove;
    shapeTool.onMouseDown = handleMouseDown;
    shapeTool.onMouseDrag = handleMouseDrag;
    shapeTool.onMouseUp = handleMouseUp;
    setTool(shapeTool);
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
  scope: string[];
  shapeType: Btwx.ShapeType;
  drawing: boolean;
} => {
  const { layer, canvasSettings, shapeTool } = state;
  const isEnabled = shapeTool.isEnabled;
  const shapeType = shapeTool.shapeType;
  const scope = layer.present.scope;
  const drawing = canvasSettings.drawing;
  return {
    isEnabled,
    shapeType,
    scope,
    drawing
  };
};

export default connect(
  mapStateToProps,
  { addShapeThunk, setCanvasDrawing, toggleShapeToolThunk }
)(ShapeTool);