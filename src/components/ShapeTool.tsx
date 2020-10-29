/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { scrollToLayer, isBetween } from '../utils';
import { RootState } from '../store/reducers';
import { DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES, DEFAULT_STAR_POINTS, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import Tooltip from '../canvas/tooltip';
import { importPaperProject, getDeepSelectItem, getNearestScopeAncestor, getSelectionBounds, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { addShapeThunk } from '../store/actions/layer';
import { LayerTypes, AddShapePayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';

interface ShapeToolProps {
  isEnabled?: boolean;
  shapeType?: Btwx.ShapeType;
  scope?: string[];
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  addShapeThunk?(payload: AddShapePayload): void;
}

const ShapeTool = (props: ShapeToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, setCanvasActiveTool, shapeType, addShapeThunk, scope } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromBounds, setFromBounds] = useState(null);
  const [toBounds, setToBounds] = useState(null);
  const [pivot, setPivot] = useState(null);
  const [maxDim, setMaxDim] = useState(null);
  const [vector, setVector] = useState(null);
  const [dims, setDims] = useState(null);
  const [constrainedDims, setConstrainedDims] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tooltip, setToolTip] = useState(null);
  const [shiftModifier, setShiftModifier] = useState(false);

  const resetState = () => {
    if (preview) {
      preview.remove();
    }
    if (tooltip) {
      tooltip.paperLayer.remove();
    }
    setFrom(null);
    setTo(null);
    setX(0);
    setY(0);
    setPivot(null);
    setVector(null);
    setDims(null);
    setMaxDim(null);
    setConstrainedDims(null);
    setToBounds(null);
    setShiftModifier(false);
    setPreview(null);
    setToolTip(null);
  }

  const renderShape = (shapeOpts: any) => {
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
              return new paperMain.Point(to.x, from.y);
            } else if (isVertical) {
              return new paperMain.Point(from.x, to.y);
            } else {
              return to;
            }
          } else {
            return to;
          }
        })();
        const shape = new paperMain.Path.Line({
          from: from,
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

  const updateTooltip = (): void => {
    if (tooltip) {
      tooltip.paperLayer.remove();
    }
    setToolTip(new Tooltip(`${Math.round(toBounds.width)} x ${Math.round(toBounds.height)}`, to, {up: true}));
  }

  const updatePreview = (): void => {
    if (preview) {
      preview.remove();
    }
    const nextPreview = renderShape({
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'ShapeToolPreview'
      }
    });
    nextPreview.removeOn({
      up: true,
      drag: true
    });
    setPreview(nextPreview);
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    const nextFrom = e.point;
    const nextX = 1;
    const nextY = 1;
    const nextTo = new paperMain.Point(nextFrom.x + nextX, nextFrom.y + nextY);
    const nextPivot = `${nextY < 0 ? 'bottom' : 'top'}${nextX < 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    const nextVector = nextTo.subtract(nextFrom);
    const nextDims = new paperMain.Rectangle({from: nextFrom, to: nextTo}).size;
    const nextMaxDim = Math.max(nextDims.width, nextDims.height);
    const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? nextFrom.x - nextMaxDim : nextFrom.x + nextMaxDim, nextVector.y < 0 ? nextFrom.y - nextMaxDim : nextFrom.y + nextMaxDim);
    const nextToBounds = new paperMain.Rectangle({
      from: nextFrom,
      to: shiftModifier ? nextContrainedDims : nextTo
    });
    setFrom(nextFrom);
    setTo(nextTo);
    setX(nextX);
    setY(nextY);
    setPivot(nextPivot);
    setVector(nextVector);
    setDims(nextDims);
    setMaxDim(nextMaxDim);
    setConstrainedDims(nextContrainedDims);
    setToBounds(nextToBounds);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    const nextTo = e.point;
    const nextX = x + e.delta.x;
    const nextY = y + e.delta.y;
    const nextPivot = `${nextY < 0 ? 'bottom' : 'top'}${nextX < 0 ? 'Right' : 'Left'}` as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    const nextVector = nextTo.subtract(from);
    const nextDims = new paperMain.Rectangle({from: from, to: nextTo}).size;
    const nextMaxDim = Math.max(nextDims.width, nextDims.height);
    const nextContrainedDims = new paperMain.Point(nextVector.x < 0 ? from.x - nextMaxDim : from.x + nextMaxDim, nextVector.y < 0 ? from.y - nextMaxDim : from.y + nextMaxDim);
    const nextToBounds = new paperMain.Rectangle({
      from: from,
      to: shiftModifier ? nextContrainedDims : nextTo
    });
    setTo(nextTo);
    setX(nextX);
    setY(nextY);
    setPivot(nextPivot);
    setVector(nextVector);
    setDims(nextDims);
    setMaxDim(nextMaxDim);
    setConstrainedDims(nextContrainedDims);
    setToBounds(nextToBounds);
    updateTooltip();
    updatePreview();
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    if (vector && vector.x !== 0 && vector.y !== 0) {
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
              overlapping: preview.bounds
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
      paperMain.tool = null;
      setCanvasActiveTool({activeTool: null, drawing: false});
      resetState();
    }
  }

  useEffect(() => {
    if (isEnabled) {
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
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
      }
    }
  }, [isEnabled]);

  useEffect(() => {
    const shapeTool = new paperMain.Tool();
    shapeTool.onMouseDown = handleMouseDown;
    shapeTool.onMouseDrag = handleMouseDrag;
    shapeTool.onMouseUp = handleMouseUp;
    setTool(shapeTool);
    paperMain.tool = null;
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  scope: string[];
  shapeType: Btwx.ShapeType;
} => {
  const { layer, canvasSettings, shapeTool } = state;
  const isEnabled = canvasSettings.activeTool === 'Shape';
  const shapeType = shapeTool.shapeType;
  const scope = layer.present.scope;
  return {
    isEnabled,
    shapeType,
    scope
  };
};

export default connect(
  mapStateToProps,
  { setCanvasActiveTool, addShapeThunk }
)(ShapeTool);