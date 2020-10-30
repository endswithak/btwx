/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getHoverBounds, getPaperLayer, getSelectionBounds, getSelectedById, getSnapPointsByBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool, setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import SnapTool from '../canvas/snapTool';

interface DragToolProps {
  hover?: string;
  selected?: string[];
  // selectedById?: {
  //   [id: string]: Btwx.Layer;
  // };
  isEnabled?: boolean;
  dragging?: boolean;
  scope?: string[];
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
  moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
}

const debugDragTool = true;
let dragToolFromBounds: any;
let dragLayerCopies: { [id: string]: paper.Item } = null;
let dragSnapTool: SnapTool;
let dragToolX = 0;
let dragToolY = 0;

const DragTool = (props: DragToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, hover, setCanvasDragging, dragging, selected, moveLayersBy, setCanvasActiveTool, scope } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [originalSelection, setOriginalSelection] = useState<string[]>(null);
  const [duplicateSelection, setDuplicateSelection] = useState<string[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [toBoundsRef, setToBoundsRef] = useState<paper.Path.Rectangle>(null);
  const [snapZoneLeft, setSnapZoneLeft] = useState<paper.Rectangle>(null);
  const [snapZoneRight, setSnapZoneRight] = useState<paper.Rectangle>(null);
  const [snapZoneTop, setSnapZoneTop] = useState<paper.Rectangle>(null);
  const [snapZoneBottom, setSnapZoneBottom] = useState<paper.Rectangle>(null);
  const [snapZoneLeftRef, setSnapZoneLeftRef] = useState<paper.Path.Rectangle>(null);
  const [snapZoneRightRef, setSnapZoneRightRef] = useState<paper.Path.Rectangle>(null);
  const [snapZoneTopRef, setSnapZoneTopRef] = useState<paper.Path.Rectangle>(null);
  const [snapZoneBottomRef, setSnapZoneBottomRef] = useState<paper.Path.Rectangle>(null);

  const resetState = () => {
    if (toBoundsRef) {
      toBoundsRef.remove();
    }
    if (snapZoneTopRef) {
      snapZoneTopRef.remove();
    }
    if (snapZoneBottomRef) {
      snapZoneBottomRef.remove();
    }
    if (snapZoneLeftRef) {
      snapZoneLeftRef.remove();
    }
    if (snapZoneRightRef) {
      snapZoneRightRef.remove();
    }
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setToBounds(null);
    setFromBounds(null);
    setSnapZoneTop(null);
    setSnapZoneBottom(null);
    setSnapZoneLeft(null);
    setSnapZoneRight(null);
    setSnapZoneTopRef(null);
    setSnapZoneBottomRef(null);
    setSnapZoneLeftRef(null);
    setSnapZoneRightRef(null);
    dragLayerCopies = null;
    dragToolFromBounds = null;
    dragSnapTool = null;
    dragToolX = 0;
    dragToolY = 0;
  }

  const getDragPivots = (e: paper.ToolEvent): { pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; inverse: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' } => {
    let pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    let inverse: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    switch(e.delta.quadrant) {
      case 1: {
        pivot = 'topLeft';
        inverse = 'bottomRight';
        break;
      }
      case 2: {
        pivot = 'topRight';
        inverse = 'bottomLeft';
        break;
      }
      case 3: {
        pivot = 'bottomRight';
        inverse = 'topLeft';
        break;
      }
      case 4: {
        pivot = 'bottomLeft';
        inverse = 'topRight';
        break;
      }
    }
    return { pivot, inverse }
  }

  const getSnapZones = (e: paper.ToolEvent, currentToBounds: paper.Rectangle): { top: paper.Rectangle; bottom: paper.Rectangle; left: paper.Rectangle; right: paper.Rectangle } => {
    // const pivot = getDragPivots(e);
    const nextSnapZoneTop = new paperMain.Rectangle({
      from: new paperMain.Point(currentToBounds.topLeft.x, paperMain.view.bounds.top),
      to: currentToBounds.rightCenter
    });
    const nextSnapZoneBottom = new paperMain.Rectangle({
      from: currentToBounds.leftCenter,
      to: new paperMain.Point(currentToBounds.bottomRight.x, paperMain.view.bounds.bottom)
    });
    const nextSnapZoneLeft = new paperMain.Rectangle({
      from: new paperMain.Point(paperMain.view.bounds.left, currentToBounds.topLeft.y),
      to: currentToBounds.bottomCenter
    });
    const nextSnapZoneRight = new paperMain.Rectangle({
      from: currentToBounds.topCenter,
      to: new paperMain.Point(paperMain.view.bounds.right, currentToBounds.bottomRight.y)
    });
    // nextSnapZoneTop.height *= (1 / paperMain.view.zoom);
    // nextSnapZoneTop.bottom = currentToBounds.center.y;
    // nextSnapZoneBottom.height *= (1 / paperMain.view.zoom);
    // nextSnapZoneBottom.top = currentToBounds.center.y;
    // nextSnapZoneLeft.width *= (1 / paperMain.view.zoom);
    // nextSnapZoneLeft.right = currentToBounds.center.x;
    // nextSnapZoneRight.width *= (1 / paperMain.view.zoom);
    // nextSnapZoneRight.left = currentToBounds.center.x;
    // return {
    //   top: pivot.inverse === 'topLeft' || pivot.inverse === 'topRight' ? nextSnapZoneTop : null,
    //   bottom: pivot.inverse === 'bottomLeft' || pivot.inverse === 'bottomRight' ? nextSnapZoneBottom : null,
    //   left: pivot.inverse === 'topLeft' || pivot.inverse === 'bottomLeft' ? nextSnapZoneLeft : null,
    //   right: pivot.inverse === 'topRight' || pivot.inverse === 'bottomRight' ? nextSnapZoneRight : null
    // }
    return {
      top: nextSnapZoneTop,
      bottom: nextSnapZoneBottom,
      left: nextSnapZoneLeft,
      right: nextSnapZoneRight
    }
  }

  const getSnapZoneSnapPoints = (snapZones: { top: paper.Rectangle; bottom: paper.Rectangle; left: paper.Rectangle; right: paper.Rectangle }): { allSnapPoints: Btwx.SnapPoint[]; xSnapPoints: Btwx.SnapPoint[]; ySnapPoints: Btwx.SnapPoint[] } => {
    const snapZoneLeftSnapPoints = snapZones.left ? getSnapPointsByBounds(snapZones.left, scope, 'y') : [];
    const snapZoneRightSnapPoints = snapZones.right ? getSnapPointsByBounds(snapZones.right, scope, 'y') : [];
    const snapZoneTopSnapPoints = snapZones.top ? getSnapPointsByBounds(snapZones.top, scope, 'x') : [];
    const snapZoneBottomSnapPoints = snapZones.bottom ? getSnapPointsByBounds(snapZones.bottom, scope, 'x') : [];
    const ySnapPoints = [...snapZoneLeftSnapPoints, ...snapZoneRightSnapPoints];
    const xSnapPoints = [...snapZoneTopSnapPoints, ...snapZoneBottomSnapPoints];
    const allSnapPoints = [...ySnapPoints, ...xSnapPoints];
    return {
      allSnapPoints,
      xSnapPoints,
      ySnapPoints
    }
  }

  const getToBounds = (e: paper.ToolEvent): paper.Rectangle => {
    const currentToBounds = new paperMain.Rectangle(toBounds ? toBounds : dragToolFromBounds);
    currentToBounds.center.x = dragToolFromBounds.center.x + dragToolX;
    currentToBounds.center.y = dragToolFromBounds.center.y + dragToolY;
    return currentToBounds;
    // const selectionBounds = getSelectionBounds();
    // selectionBounds.center.x += e.delta.x;
    // selectionBounds.center.y += e.delta.y;
    // return selectionBounds;
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    // const dragLayers = selected.length > 0 && selected.includes(hover) ? selected : [hover];
    // const dragLayersBounds = selected.length > 0 && selected.includes(hover) ? getSelectionBounds() : getHoverBounds();
    // setOriginalSelection(dragLayers);
    // setFromBounds(dragLayersBounds);
    const selectedItems = paperMain.project.getItems({ data: { selected: true } });
    const hoverItem = paperMain.project.getItem({ data: { hover: true } });
    const isDragHover = selected.length === 0 || selected.length > 0 && !selected.includes(hover);
    dragToolFromBounds = isDragHover ? getHoverBounds() : getSelectionBounds();
    dragLayerCopies = isDragHover ? { [hover]: hoverItem.clone({insert: false}) } : selectedItems.reduce((result, current) => {
      result = {
        ...result,
        [current.data.id]: current.clone({insert: false})
      }
      return result;
    }, {} as { [id: string]: paper.Item });
    dragSnapTool = new SnapTool();
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    if (dragToolFromBounds && selected.length > 0) {
      dragToolX += e.delta.x;
      dragToolY += e.delta.y;
      const currentToBounds = getToBounds(e);
      const snapZones = getSnapZones(e, currentToBounds);
      const snapPoints = getSnapZoneSnapPoints(snapZones);
      dragSnapTool.snapBounds = currentToBounds;
      dragSnapTool.snapPoints = snapPoints.allSnapPoints;
      dragSnapTool.xSnapsPoints = snapPoints.xSnapPoints;
      dragSnapTool.ySnapPoints = snapPoints.ySnapPoints;
      dragSnapTool.updateXSnap({
        event: e,
        snapTo: {
          left: true,
          right: true,
          center: true
        },
        handleSnapped: (snapPoint: Btwx.SnapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'left':
              currentToBounds.center.x = snapPoint.point + (dragToolFromBounds.width / 2);
              break;
            case 'center':
              currentToBounds.center.x = snapPoint.point;
              break;
            case 'right':
              currentToBounds.center.x = snapPoint.point - (dragToolFromBounds.width / 2);
              break;
          }
        },
        handleSnap: (closestXSnap: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }) => {
          switch(closestXSnap.bounds.side) {
            case 'left':
              currentToBounds.center.x = closestXSnap.snapPoint.point + (dragToolFromBounds.width / 2);
              break;
            case 'center':
              currentToBounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              currentToBounds.center.x = closestXSnap.snapPoint.point - (dragToolFromBounds.width / 2);
              break;
          }
        }
      });
      dragSnapTool.updateYSnap({
        event: e,
        snapTo: {
          top: true,
          bottom: true,
          center: true
        },
        handleSnapped: (snapPoint: Btwx.SnapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'top':
              currentToBounds.center.y = snapPoint.point + (dragToolFromBounds.height / 2);
              break;
            case 'center':
              currentToBounds.center.y = snapPoint.point;
              break;
            case 'bottom':
              currentToBounds.center.y = snapPoint.point - (dragToolFromBounds.height / 2);
              break;
          }
        },
        handleSnap: (closestYSnap: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }) => {
          switch(closestYSnap.bounds.side) {
            case 'top':
              currentToBounds.center.y = closestYSnap.snapPoint.point + (dragToolFromBounds.height / 2);
              break;
            case 'center':
              currentToBounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              currentToBounds.center.y = closestYSnap.snapPoint.point - (dragToolFromBounds.height / 2);
              break;
          }
        }
      });
      const translate = {
        x: currentToBounds.center.x - dragToolFromBounds.center.x,
        y: currentToBounds.center.y - dragToolFromBounds.center.y
      };
      selected.forEach((id) => {
        const paperLayer = getPaperLayer(id);
        const copyLayer = dragLayerCopies[id];
        paperLayer.position.x = copyLayer.position.x + translate.x;
        paperLayer.position.y = copyLayer.position.y + translate.y;
      });
      dragSnapTool.updateGuides();
      setToBounds(currentToBounds);
      setSnapZoneTop(snapZones.top);
      setSnapZoneBottom(snapZones.bottom);
      setSnapZoneLeft(snapZones.left);
      setSnapZoneRight(snapZones.right);
      if (!dragging) {
        setCanvasDragging({dragging: true});
      }
    }
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    if (selected.length > 0) {
      moveLayersBy({layers: selected, x: 0, y: 0});
    }
    if (dragging) {
      setCanvasDragging({dragging: false});
    }
    resetState();
  }

  useEffect(() => {
    if (tool) {
      tool.onMouseDown = handleMouseDown;
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [toBounds, selected, hover, dragging, isEnabled]);

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
    const dragTool = new paperMain.Tool();
    dragTool.onMouseDown = handleMouseDown;
    dragTool.onMouseDrag = handleMouseDrag;
    dragTool.onMouseUp = handleMouseUp;
    setTool(dragTool);
    paperMain.tool = null;
  }, []);

  // DEBUG

  if (debugDragTool) {
    useEffect(() => {
      if (isEnabled && snapZoneTop) {
        const nextSnapZoneRef = new paperMain.Path.Rectangle({
          rectangle: snapZoneTop,
          fillColor: 'magenta',
          opacity: 0.25,
          data: {
            id: 'SnapZone',
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: 'SnapZone'
          }
        });
        nextSnapZoneRef.removeOn({
          drag: true,
          up: true
        });
        setSnapZoneTopRef(nextSnapZoneRef);
      }
    }, [snapZoneTop]);

    useEffect(() => {
      if (isEnabled && snapZoneBottom) {
        const nextSnapZoneRef = new paperMain.Path.Rectangle({
          rectangle: snapZoneBottom,
          fillColor: 'yellow',
          opacity: 0.25,
          data: {
            id: 'SnapZone',
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: 'SnapZone'
          }
        });
        nextSnapZoneRef.removeOn({
          drag: true,
          up: true
        });
        setSnapZoneBottomRef(nextSnapZoneRef);
      }
    }, [snapZoneBottom]);

    useEffect(() => {
      if (isEnabled && snapZoneLeft) {
        const nextSnapZoneRef = new paperMain.Path.Rectangle({
          rectangle: snapZoneLeft,
          fillColor: 'cyan',
          opacity: 0.25,
          data: {
            id: 'SnapZone',
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: 'SnapZone'
          }
        });
        nextSnapZoneRef.removeOn({
          drag: true,
          up: true
        });
        setSnapZoneLeftRef(nextSnapZoneRef);
      }
    }, [snapZoneLeft]);

    useEffect(() => {
      if (isEnabled && snapZoneRight) {
        const nextSnapZoneRef = new paperMain.Path.Rectangle({
          rectangle: snapZoneRight,
          fillColor: theme.text.lightest,
          data: {
            id: 'SnapZone',
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: 'SnapZone'
          }
        });
        nextSnapZoneRef.removeOn({
          drag: true,
          up: true
        });
        setSnapZoneRightRef(nextSnapZoneRef);
      }
    }, [snapZoneRight]);
  }

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
  selected: string[];
  isEnabled: boolean;
  // selectedById: {
  //   [id: string]: Btwx.Layer;
  // };
  dragging: boolean;
  scope: string[];
} => {
  const { layer, canvasSettings } = state;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Drag';
  // const selectedById = getSelectedById(state);
  const dragging = canvasSettings.dragging;
  const scope = layer.present.scope;
  return {
    hover,
    selected,
    isEnabled,
    // selectedById,
    dragging,
    scope
  };
};

export default connect(
  mapStateToProps,
  { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool, setCanvasDragging }
)(DragTool);

// /* eslint-disable @typescript-eslint/no-use-before-define */
// // import { remote } from 'electron';
// import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
// import { connect } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { getHoverBounds, getPaperLayer, getSelectedBounds, getSelectedById, getSnapPointsByBounds } from '../store/selectors/layer';
// import { paperMain } from '../canvas';
// import { setCanvasActiveTool, setCanvasDragging } from '../store/actions/canvasSettings';
// import { CanvasSettingsTypes, SetCanvasDraggingPayload, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
// import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
// import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
// import { ThemeContext } from './ThemeProvider';
// import SnapTool from '../canvas/snapTool';

// interface DragToolProps {
//   hover?: string;
//   selected?: string[];
//   selectedById?: {
//     [id: string]: Btwx.Layer;
//   };
//   isEnabled?: boolean;
//   selectedBounds?: paper.Rectangle;
//   hoverBounds?: paper.Rectangle;
//   dragging?: boolean;
//   setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
//   moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
//   duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
//   removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
//   setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
// }

// const debugDragTool = true;

// const DragTool = (props: DragToolProps): ReactElement => {
//   const theme = useContext(ThemeContext);
//   const { isEnabled, hover, hoverBounds, setCanvasDragging, dragging, selected, moveLayersBy, setCanvasActiveTool, selectedById, selectedBounds } = props;
//   const [tool, setTool] = useState<paper.Tool>(null);
//   const [originalSelection, setOriginalSelection] = useState<string[]>(null);
//   const [duplicateSelection, setDuplicateSelection] = useState<string[]>(null);
//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);
//   const [from, setFrom] = useState<paper.Point>(null);
//   const [to, setTo] = useState<paper.Point>(null);
//   const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
//   const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
//   const [toBoundsRef, setToBoundsRef] = useState<paper.Path.Rectangle>(null);
//   const [extendedToBounds, setExtendedToBounds] = useState<paper.Rectangle>(null);
//   const [extendedToBoundsRef, setExtendedToBoundsRef] = useState<paper.Path.Rectangle>(null);
//   const [snapZone, setSnapZone] = useState<paper.Rectangle>(null);
//   const [snapZoneRef, setSnapZoneRef] = useState<paper.Path.Rectangle>(null);
//   const [topLeftQudrant, setTopLeftQuadrant] = useState<paper.Rectangle>(null);
//   const [topRightQudrant, setTopRightQuadrant] = useState<paper.Rectangle>(null);
//   const [bottomLeftQudrant, setBottomLeftQuadrant] = useState<paper.Rectangle>(null);
//   const [bottomRightQudrant, setBottomRightQuadrant] = useState<paper.Rectangle>(null);
//   const [snapTool, setSnapTool] = useState(new SnapTool());

//   const resetState = () => {
//     if (toBoundsRef) {
//       toBoundsRef.remove();
//     }
//     if (extendedToBoundsRef) {
//       extendedToBoundsRef.remove();
//     }
//     if (snapZoneRef) {
//       snapZoneRef.remove();
//     }
//     setOriginalSelection(null);
//     setDuplicateSelection(null);
//     setFrom(null);
//     setTo(null);
//     setX(0);
//     setY(0);
//     setToBounds(null);
//     setFromBounds(null);
//     setSnapZone(null);
//     setSnapZoneRef(null);
//     setExtendedToBoundsRef(null);
//     setToBoundsRef(null);
//     setTopLeftQuadrant(null);
//     setTopRightQuadrant(null);
//     setBottomLeftQuadrant(null);
//     setBottomRightQuadrant(null);
//   }

//   const getQuadrantBounds = (qudrant: number) => {
//     switch(qudrant) {
//       case 1:
//         return topLeftQudrant;
//       case 2:
//         return topRightQudrant;
//       case 3:
//         return bottomRightQudrant;
//       case 4:
//         return bottomLeftQudrant;
//     }
//   }

//   const getPointQuadrant = (point: paper.Point) => {
//     if (topLeftQudrant.contains(point)) {
//       return 1;
//     }
//     if (topRightQudrant.contains(point)) {
//       return 2;
//     }
//     if (bottomRightQudrant.contains(point)) {
//       return 3;
//     }
//     if (bottomLeftQudrant.contains(point)) {
//       return 4;
//     }
//   }

//   const getExtendedToBounds = (nextToBounds: paper.Rectangle, pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
//     switch(pivot) {
//       case 'topLeft':
//         return new paperMain.Rectangle({
//           from: nextToBounds.topLeft,
//           to: new paperMain.Point(nextToBounds.bottomRight.x + nextToBounds.width, nextToBounds.bottomRight.y + nextToBounds.height)
//         });
//       case 'topRight':
//         return new paperMain.Rectangle({
//           from: nextToBounds.topRight,
//           to: new paperMain.Point(nextToBounds.bottomLeft.x - nextToBounds.width, nextToBounds.bottomLeft.y + nextToBounds.height)
//         });
//       case 'bottomRight':
//         return new paperMain.Rectangle({
//           from: nextToBounds.bottomRight,
//           to: new paperMain.Point(nextToBounds.topLeft.x - nextToBounds.width, nextToBounds.topLeft.y - nextToBounds.height)
//         });
//       case 'bottomLeft':
//         return new paperMain.Rectangle({
//           from: nextToBounds.bottomLeft,
//           to: new paperMain.Point(nextToBounds.topRight.x + nextToBounds.width, nextToBounds.topRight.y - nextToBounds.height)
//         });
//     }
//   }

//   const getDragPivots = (e: paper.ToolEvent): { pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; inverse: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' } => {
//     const vector = from.subtract(e.point);
//     let pivot: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
//     let inverse: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
//     switch(vector.quadrant) {
//       case 1: {
//         pivot = 'bottomRight';
//         inverse = 'topLeft';
//         break;
//       }
//       case 2: {
//         pivot = 'bottomLeft';
//         inverse = 'topRight';
//         break;
//       }
//       case 3: {
//         pivot = 'topLeft';
//         inverse = 'bottomRight';
//         break;
//       }
//       case 4: {
//         pivot = 'topRight';
//         inverse = 'bottomLeft';
//         break;
//       }
//     }
//     return { pivot, inverse }
//   }

//   const handleMouseDown = (e: paper.ToolEvent): void => {
//     const dragLayers = selected.length > 0 && selected.includes(hover) ? selected : [hover];
//     const dragLayersBounds = selected.length > 0 && selected.includes(hover) ? selectedBounds : hoverBounds;
//     setOriginalSelection(dragLayers);
//     setFromBounds(dragLayersBounds);
//     setFrom(e.point);
//     setTo(e.point);
//     setToBounds(dragLayersBounds);
//     setTopLeftQuadrant(new paperMain.Rectangle({
//       from: paperMain.view.bounds.topLeft,
//       to: paperMain.view.bounds.center
//     }));
//     setTopRightQuadrant(new paperMain.Rectangle({
//       from: paperMain.view.bounds.topRight,
//       to: paperMain.view.bounds.center
//     }));
//     setBottomRightQuadrant(new paperMain.Rectangle({
//       from: paperMain.view.bounds.bottomRight,
//       to: paperMain.view.bounds.center
//     }));
//     setBottomLeftQuadrant(new paperMain.Rectangle({
//       from: paperMain.view.bounds.bottomLeft,
//       to: paperMain.view.bounds.center
//     }));
//   }

//   const handleMouseDrag = (e: paper.ToolEvent): void => {
//     if (!dragging) {
//       setCanvasDragging({dragging: true});
//     }
//     const nextX = x + e.delta.x;
//     const nextY = y + e.delta.y;
//     const currentToBounds = new paperMain.Rectangle(toBounds);
//     currentToBounds.center.x = fromBounds.center.x + nextX;
//     currentToBounds.center.y = fromBounds.center.y + nextY;
//     const pivots = getDragPivots(e);
//     // const nextExtendedToBounds = getExtendedToBounds(currentToBounds, pivots.pivot);
//     // const extendedInversePivotQuadrant = getPointQuadrant(nextExtendedToBounds[pivots.inverse]);
//     // const pivotQuadrant = getPointQuadrant(currentToBounds[pivots.pivot]);
//     const nextSnapZone = new paperMain.Rectangle({
//       // from: new paperMain.Point(paperMain.view.bounds[pivots.inverse].x, currentToBounds[pivots.inverse].y),
//       // to: new paperMain.Point(currentToBounds[pivots.inverse].x, currentToBounds[pivots.pivot].y)
//       // from: paperMain.view.bounds[pivots.inverse],
//       // to: new paperMain.Point(currentToBounds[pivots.pivot].x, paperMain.view.bounds[pivots.pivot].y)
//       from: currentToBounds[pivots.pivot],
//       to: paperMain.view.bounds[pivots.inverse]
//     });
//     const nextSnapZonePoints = getSnapPointsByBounds(nextSnapZone);
//     snapTool.snapBounds = currentToBounds;
//     snapTool.snapPoints = nextSnapZonePoints;
//     snapTool.updateXSnap({
//       event: e,
//       snapTo: {
//         left: true,
//         right: true,
//         center: true
//       },
//       handleSnapped: (snapPoint: Btwx.SnapPoint) => {
//         switch(snapPoint.boundsSide) {
//           case 'left':
//             currentToBounds.center.x = snapPoint.point + (fromBounds.width / 2);
//             break;
//           case 'center':
//             currentToBounds.center.x = snapPoint.point;
//             break;
//           case 'right':
//             currentToBounds.center.x = snapPoint.point - (fromBounds.width / 2);
//             break;
//         }
//       },
//       handleSnap: (closestXSnap: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }) => {
//         switch(closestXSnap.bounds.side) {
//           case 'left':
//             currentToBounds.center.x = closestXSnap.snapPoint.point + (fromBounds.width / 2);
//             break;
//           case 'center':
//             currentToBounds.center.x = closestXSnap.snapPoint.point;
//             break;
//           case 'right':
//             currentToBounds.center.x = closestXSnap.snapPoint.point - (fromBounds.width / 2);
//             break;
//         }
//       }
//     });
//     snapTool.updateYSnap({
//       event: e,
//       snapTo: {
//         top: true,
//         bottom: true,
//         center: true
//       },
//       handleSnapped: (snapPoint: Btwx.SnapPoint) => {
//         switch(snapPoint.boundsSide) {
//           case 'top':
//             currentToBounds.center.y = snapPoint.point + (fromBounds.height / 2);
//             break;
//           case 'center':
//             currentToBounds.center.y = snapPoint.point;
//             break;
//           case 'bottom':
//             currentToBounds.center.y = snapPoint.point - (fromBounds.height / 2);
//             break;
//         }
//       },
//       handleSnap: (closestYSnap: { bounds: Btwx.SnapBound; snapPoint: Btwx.SnapPoint; distance: number }) => {
//         switch(closestYSnap.bounds.side) {
//           case 'top':
//             currentToBounds.center.y = closestYSnap.snapPoint.point + (fromBounds.height / 2);
//             break;
//           case 'center':
//             currentToBounds.center.y = closestYSnap.snapPoint.point;
//             break;
//           case 'bottom':
//             currentToBounds.center.y = closestYSnap.snapPoint.point - (fromBounds.height / 2);
//             break;
//         }
//       }
//     });
//     const translate = {
//       x: currentToBounds.center.x - fromBounds.center.x,
//       y: currentToBounds.center.y - fromBounds.center.y
//     };
//     selected.forEach((id) => {
//       const paperLayer = getPaperLayer(id);
//       const layerItem = selectedById[id];
//       paperLayer.position.x = layerItem.frame.x + translate.x;
//       paperLayer.position.y = layerItem.frame.y + translate.y;
//     });
//     snapTool.updateGuides();
//     setX(nextX);
//     setY(nextY);
//     setTo(e.point);
//     setToBounds(currentToBounds);
//     // setExtendedToBounds(nextExtendedToBounds);
//     setSnapZone(nextSnapZone);
//   }

//   const handleMouseUp = (e: paper.ToolEvent): void => {
//     if (selected.length > 0 && (x !== 0 || y !== 0)) {
//       moveLayersBy({layers: selected, x: x, y: y});
//     }
//     if (dragging) {
//       setCanvasDragging({dragging: false});
//     }
//     resetState();
//   }

//   useEffect(() => {
//     if (tool) {
//       tool.onMouseDown = handleMouseDown;
//       tool.onMouseDrag = handleMouseDrag;
//       tool.onMouseUp = handleMouseUp;
//     }
//   }, [toBounds, dragging, selectedBounds, hoverBounds, isEnabled]);

//   useEffect(() => {
//     if (isEnabled) {
//       if (tool) {
//         tool.activate();
//       }
//     } else {
//       if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
//         paperMain.tool = null;
//       }
//       if (snapZoneRef) {
//         snapZoneRef.remove();
//       }
//       if (toBoundsRef) {
//         toBoundsRef.remove();
//       }
//       if (extendedToBoundsRef) {
//         extendedToBoundsRef.remove();
//       }
//     }
//   }, [isEnabled]);

//   useEffect(() => {
//     const dragTool = new paperMain.Tool();
//     dragTool.onMouseDown = handleMouseDown;
//     dragTool.onMouseDrag = handleMouseDrag;
//     dragTool.onMouseUp = handleMouseUp;
//     setTool(dragTool);
//     paperMain.tool = null;
//   }, []);

//   // DEBUG

//   // useEffect(() => {
//   //   if (isEnabled && debugDragTool && toBounds) {
//   //     const nextToBoundsRef = new paperMain.Path.Rectangle({
//   //       from: toBounds.topLeft,
//   //       to: toBounds.bottomRight,
//   //       fillColor: theme.palette.recording,
//   //       opacity: 0.25,
//   //       data: {
//   //         id: 'ToBoundsRef',
//   //         type: 'UIElement',
//   //         interactive: false,
//   //         interactiveType: null,
//   //         elementId: 'ToBoundsRef'
//   //       }
//   //     });
//   //     nextToBoundsRef.removeOn({
//   //       drag: true,
//   //       up: true
//   //     });
//   //     setToBoundsRef(nextToBoundsRef);
//   //   }
//   // }, [toBounds]);

//   // useEffect(() => {
//   //   if (isEnabled && debugDragTool && extendedToBounds) {
//   //     const nextExtendedToBoundsRef = new paperMain.Path.Rectangle({
//   //       from: extendedToBounds.topLeft,
//   //       to: extendedToBounds.bottomRight,
//   //       fillColor: 'yellow',
//   //       opacity: 0.25,
//   //       data: {
//   //         id: 'ToBoundsRef',
//   //         type: 'UIElement',
//   //         interactive: false,
//   //         interactiveType: null,
//   //         elementId: 'ToBoundsRef'
//   //       }
//   //     });
//   //     nextExtendedToBoundsRef.removeOn({
//   //       drag: true,
//   //       up: true
//   //     });
//   //     setExtendedToBoundsRef(nextExtendedToBoundsRef);
//   //   }
//   // }, [extendedToBounds]);

//   useEffect(() => {
//     if (isEnabled && debugDragTool && snapZone) {
//       const nextSnapZoneRef = new paperMain.Path.Rectangle({
//         rectangle: snapZone,
//         fillColor: theme.palette.primary,
//         opacity: 0.25,
//         data: {
//           id: 'SnapZone',
//           type: 'UIElement',
//           interactive: false,
//           interactiveType: null,
//           elementId: 'SnapZone'
//         }
//       });
//       nextSnapZoneRef.removeOn({
//         drag: true,
//         up: true
//       });
//       setSnapZoneRef(nextSnapZoneRef);
//     }
//   }, [snapZone]);

//   return (
//     <></>
//   );
// }

// const mapStateToProps = (state: RootState): {
//   hover: string;
//   selected: string[];
//   isEnabled: boolean;
//   selectedById: {
//     [id: string]: Btwx.Layer;
//   };
//   selectedBounds: paper.Rectangle;
//   hoverBounds: paper.Rectangle;
//   dragging: boolean;
// } => {
//   const { layer, canvasSettings } = state;
//   const hover = layer.present.hover;
//   const selected = layer.present.selected;
//   const isEnabled = canvasSettings.activeTool === 'Drag';
//   const selectedById = getSelectedById(state);
//   const selectedBounds = getSelectedBounds(state);
//   const hoverBounds = getHoverBounds(state);
//   const dragging = canvasSettings.dragging;
//   return {
//     hover,
//     selected,
//     isEnabled,
//     selectedById,
//     selectedBounds,
//     hoverBounds,
//     dragging
//   };
// };

// export default connect(
//   mapStateToProps,
//   { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasActiveTool, setCanvasDragging }
// )(DragTool);