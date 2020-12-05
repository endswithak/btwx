/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import paper from 'paper';
import { isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import Tooltip from '../canvas/tooltip';
import { getLayerPaperScopes } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDrawingPayload } from '../store/actionTypes/canvasSettings';
import { addShapeThunk } from '../store/actions/layer';
import { AddShapePayload } from '../store/actionTypes/layer';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface ShapeToolStateProps {
  isEnabled?: boolean;
  shapeType?: Btwx.ShapeType;
  scope?: string[];
  paperScope?: number;
  layerPaperScopes?: {
    [id: string]: paper.Project;
  };
  drawing?: boolean;
  activeArtboard?: string;
  activeArtboardPaperScope?: number;
}

interface ShapeToolDispatchProps {
  addShapeThunk?(payload: AddShapePayload): void;
  setCanvasDrawing?(payload: SetCanvasDrawingPayload): CanvasSettingsTypes;
  toggleShapeToolThunk?(shapeType: Btwx.ShapeType): void;
}

type ShapeToolProps = (
  ShapeToolStateProps &
  ShapeToolDispatchProps &
  PaperToolProps
);

const ShapeTool = (props: ShapeToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, shapeType, addShapeThunk, activeArtboard, activeArtboardPaperScope, scope, paperScope, layerPaperScopes, setCanvasDrawing, drawing, toggleShapeToolThunk, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
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
    const drawingPreview = uiPaperScope.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = uiPaperScope.projects[0].getItem({ data: { id: 'tooltips' }});
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
  }

  const renderShape = (shapeOpts: any) => {
    const fromPoint = from ? from : dragEvent.downPoint;
    switch(shapeType) {
      case 'Rectangle':
        return new uiPaperScope.Path.Rectangle({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Ellipse':
        return new uiPaperScope.Path.Ellipse({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          ...shapeOpts
        });
      case 'Rounded':
        return new uiPaperScope.Path.Rectangle({
          from: toBounds.topLeft,
          to: toBounds.bottomRight,
          radius: (maxDim / 2) * DEFAULT_ROUNDED_RADIUS,
          ...shapeOpts
        });
      case 'Polygon': {
        const shape = new uiPaperScope.Path.RegularPolygon({
          center: new uiPaperScope.Point(0, 0),
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
        const shape = new uiPaperScope.Path.Star({
          center: new uiPaperScope.Point(0, 0),
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
              return new uiPaperScope.Point(toBounds[handle].x, fromPoint.y);
            } else if (isVertical) {
              return new uiPaperScope.Point(fromPoint.x, toBounds[handle].y);
            } else {
              return toBounds[handle];
            }
          } else {
            return toBounds[handle];
          }
        })();
        const shape = new uiPaperScope.Path.Line({
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
    const drawingPreview = uiPaperScope.projects[0].getItem({ data: { id: 'drawingPreview' }});
    const tooltips = uiPaperScope.projects[0].getItem({ data: { id: 'tooltips' }});
    drawingPreview.removeChildren();
    tooltips.removeChildren();
    const nextTooltip = new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, dragEvent.point, {up: true});
    const nextPreview = renderShape({
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / uiPaperScope.view.zoom,
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
    if (moveEvent && isEnabled && !drawing) {
      const nextSnapBounds = new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(moveEvent.point.x - 0.5, moveEvent.point.y - 0.5),
        to: new uiPaperScope.Point(moveEvent.point.x + 0.5, moveEvent.point.y + 0.5)
      });
      setSnapBounds(nextSnapBounds);
    }
  }, [moveEvent])

  useEffect(() => {
    if (downEvent && isEnabled) {
      if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
        uiPaperScope.projects[0].activate();
      }
      if (initialToBounds) {
        setFrom(initialToBounds.center);
      } else {
        setFrom(downEvent.point);
      }
    }
  }, [downEvent])

  useEffect(() => {
    if (dragEvent && isEnabled) {
      const fromPoint = from ? from : dragEvent.downPoint;
      const nextVector = dragEvent.point.subtract(fromPoint);
      const nextHandle = `${nextVector.y > 0 ? 'bottom' : 'top'}${nextVector.x > 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
      const nextDims = new uiPaperScope.Rectangle({from: fromPoint, to: dragEvent.point}).size;
      const nextMaxDim = Math.max(nextDims.width, nextDims.height);
      const nextContrainedDims = new uiPaperScope.Point(nextVector.x < 0 ? fromPoint.x - nextMaxDim : fromPoint.x + nextMaxDim, nextVector.y < 0 ? fromPoint.y - nextMaxDim : fromPoint.y + nextMaxDim);
      const nextSnapBounds = new uiPaperScope.Rectangle({
        from: fromPoint,
        to: dragEvent.modifiers.shift ? nextContrainedDims : dragEvent.point
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
      const paperLayer = renderShape({
        insert: false
      });
      const fromPoint = (paperLayer as paper.Path).firstSegment.point;
      const toPoint = (paperLayer as paper.Path).lastSegment.point;
      const vector = toPoint.subtract(fromPoint);
      const parentItem = Object.keys(layerPaperScopes).reduce((result, current, index) => {
        const paperScope = layerPaperScopes[current];
        if (paperScope) {
          const hitTest = paperScope.getItem({
            data: (data: any) => {
              return data.id === 'artboardBackground';
            },
            overlapping: paperLayer.bounds
          });
          return hitTest ? { id: hitTest.parent.data.id, paperScope: index + 1, paperLayer: hitTest.parent } : result;
        } else {
          return result;
        }
      }, {
        id: activeArtboard,
        paperScope: activeArtboardPaperScope,
        paperLayer: layerPaperScopes[activeArtboard].activeLayer
      });
      addShapeThunk({
        layer: {
          parent: parentItem.id,
          name: shapeType,
          frame: {
            x: paperLayer.position.x - parentItem.paperLayer.position.x,
            y: paperLayer.position.y - parentItem.paperLayer.position.y,
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
  }, [upEvent]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && drawing) {
      if (keyDownEvent.key === 'shift') {
        setSnapBounds(new uiPaperScope.Rectangle({
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
        setSnapBounds(new uiPaperScope.Rectangle({
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
      if (tool && uiPaperScope.tool && (uiPaperScope.tool as any)._index === (tool as any)._index) {
        uiPaperScope.tool = null;
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
        resizeHandle={handle} />
    : null
  );
}

const mapStateToProps = (state: RootState): ShapeToolStateProps => {
  const { layer, canvasSettings, shapeTool } = state;
  const isEnabled = shapeTool.isEnabled;
  const shapeType = shapeTool.shapeType;
  const scope = layer.present.scope;
  const paperScope = layer.present.paperScope;
  const drawing = canvasSettings.drawing;
  const layerPaperScopes = getLayerPaperScopes(state);
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardPaperScope = activeArtboard ? (layer.present.byId[activeArtboard] as Btwx.Artboard).paperScope : null;
  return {
    isEnabled,
    shapeType,
    scope,
    paperScope,
    drawing,
    layerPaperScopes,
    activeArtboard,
    activeArtboardPaperScope
  };
};

const mapDispatchToProps = {
  addShapeThunk,
  setCanvasDrawing,
  toggleShapeToolThunk
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ShapeTool),
  {
    all: true
  }
);