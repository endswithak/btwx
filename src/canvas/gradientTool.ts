import store from '../store';
import { setLayerFillGradientOrigin, setLayerFillGradientDestination, setLayerStrokeGradientOrigin, setLayerStrokeGradientDestination } from '../store/actions/layer';
import { getPaperLayer, getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { paperMain } from './index';
import InsertTool from './insertTool';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class GradientTool {
  enabled: boolean;
  handle: 'origin' | 'destination';
  prop: 'fill' | 'stroke';
  insertTool: InsertTool;
  from: paper.Point;
  to: paper.Point;
  toBounds: paper.Rectangle;
  fromBounds: paper.Rectangle;
  x: number;
  y: number;
  originHandle: paper.Shape;
  destinationHandle: paper.Shape;
  gradientLines: paper.Path.Line[];
  snap: {
    x: em.SnapPoint;
    y: em.SnapPoint;
  };
  snapTool: SnapTool;
  snapPoints: em.SnapPoint[];
  snapBreakThreshholdMin: number;
  snapBreakThreshholdMax: number;
  constructor() {
    this.handle = null;
    this.prop = null;
    this.enabled = false;
    this.toBounds = null;
    this.fromBounds = null;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
    this.snapBreakThreshholdMin = -8;
    this.snapBreakThreshholdMax = 8;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.snapTool = null;
  }
  enable(handle: 'origin' | 'destination', prop: 'fill' | 'stroke'): void {
    this.enabled = true;
    this.handle = handle;
    this.prop = prop;
    this.originHandle = paperMain.project.getItem({data: {id: 'gradientFrameOriginHandle'}}) as paper.Shape;
    this.destinationHandle = paperMain.project.getItem({data: {id: 'gradientFrameDestinationHandle'}}) as paper.Shape;
    this.gradientLines = paperMain.project.getItems({data: {id: 'gradientFrameLine'}}) as paper.Path.Line[];
    this.fromBounds = new paperMain.Rectangle(handle === 'origin' ? this.originHandle.bounds : this.destinationHandle.bounds);
    this.snapTool = new SnapTool();
  }
  disable(): void {
    this.enabled = false;
    this.handle = null;
    this.prop = null;
    this.toBounds = null;
    this.fromBounds = null;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
    this.snapBreakThreshholdMin = -8;
    this.snapBreakThreshholdMax = 8;
    this.snapPoints = [];
    this.snap = {
      x: null,
      y: null
    };
    this.snapTool = null;
  }
  updateOrigin(event: paper.ToolEvent, state: RootState) {
    const paperLayer = getPaperLayer(state.gradientEditor.layer);
    const newOrigin = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: newOrigin,
      destination: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).destination
    } as em.PaperGradientFill
    this.originHandle.bounds.center.x = newOrigin.x;
    this.originHandle.bounds.center.y = newOrigin.y;
    this.gradientLines.forEach((line) => {
      line.firstSegment.point.x = newOrigin.x;
      line.firstSegment.point.y = newOrigin.y;
    });
  }
  updateDestination(event: paper.ToolEvent, state: RootState) {
    const paperLayer = getPaperLayer(state.gradientEditor.layer);
    const newDestination = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).origin,
      destination: newDestination
    } as em.PaperGradientFill
    this.destinationHandle.bounds.center.x = newDestination.x;
    this.destinationHandle.bounds.center.y = newDestination.y;
    this.gradientLines.forEach((line) => {
      line.lastSegment.point.x = newDestination.x;
      line.lastSegment.point.y = newDestination.y;
    });
  }
  updateXSnap(event: paper.ToolEvent) {
    if (this.snap.x) {
      // check if event delta will exceed X snap point min/max threshold
      if (this.snap.x.breakThreshold + event.delta.x < this.snapBreakThreshholdMin || this.snap.x.breakThreshold + event.delta.x > this.snapBreakThreshholdMax) {
        // if exceeded, adjust selection bounds...
        // clear X snap, and reset X snap threshold
        this.snap.x = null;
      } else {
        this.toBounds.center.x = this.snap.x.point;
        // if not exceeded, update X snap threshold
        this.snap.x.breakThreshold += event.delta.x;
      }
    } else {
      const closestXSnap = this.snapTool.closestXSnapPoint({
        snapPoints: this.snapPoints,
        bounds: this.toBounds,
        snapTo: {
          left: false,
          right: false,
          center: true
        }
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestXSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        this.toBounds.center.x = closestXSnap.snapPoint.point;
        this.snap.x = {
          ...closestXSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestXSnap.bounds.side as 'left' | 'right' | 'center'
        };
      }
    }
  }
  updateYSnap(event: paper.ToolEvent) {
    if (this.snap.y) {
      // check if event delta will exceed Y snap point min/max threshold
      if (this.snap.y.breakThreshold + event.delta.y < this.snapBreakThreshholdMin || this.snap.y.breakThreshold + event.delta.y > this.snapBreakThreshholdMax) {
        // if exceeded, adjust selection bounds...
        // clear Y snap, and reset Y snap threshold
        this.snap.y = null;
      } else {
        this.toBounds.center.y = this.snap.y.point;
        // if not exceeded, update Y snap threshold
        this.snap.y.breakThreshold += event.delta.y;
      }
    } else {
      const closestYSnap = this.snapTool.closestYSnapPoint({
        snapPoints: this.snapPoints,
        bounds: this.toBounds,
        snapTo: {
          top: false,
          bottom: false,
          center: true
        }
      });
      // if selection bounds is within 2 units from...
      // closest point, snap to that point
      if (closestYSnap.distance <= (1 / paperMain.view.zoom) * 2) {
        this.toBounds.center.y = closestYSnap.snapPoint.point;
        this.snap.y = {
          ...closestYSnap.snapPoint,
          breakThreshold: 0,
          boundsSide: closestYSnap.bounds.side as 'top' | 'bottom' | 'center'
        };
      }
    }
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.insertTool.onKeyDown(event);
  }
  onKeyUp(event: paper.KeyEvent): void {
    this.insertTool.onKeyUp(event);
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      this.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => snapPoint.id === state.gradientEditor.layer);
      this.from = event.point;
      this.toBounds = new paperMain.Rectangle(this.fromBounds);
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      this.to = event.point;
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.toBounds.center.x = this.fromBounds.center.x + this.x;
      this.toBounds.center.y = this.fromBounds.center.y + this.y;
      this.updateXSnap(event);
      this.updateYSnap(event);
      switch(this.handle) {
        case 'origin': {
          this.updateOrigin(event, state);
          break;
        }
        case 'destination': {
          this.updateDestination(event, state);
          break;
        }
      }
      this.snapTool.updateGuides({
        snapPoints: this.snapPoints,
        bounds: this.toBounds,
        xSnap: this.snap.x,
        ySnap: this.snap.y
      });
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x !== 0 || this.y !== 0) {
        const state = store.getState().layer.present;
        const paperLayer = getPaperLayer(state.selected[0]);
        const fillColor = paperLayer.fillColor as em.PaperGradientFill;
        const strokeColor = paperLayer.strokeColor as em.PaperGradientFill;
        let x;
        let y;
        switch(this.handle) {
          case 'origin': {
            switch(this.prop) {
              case 'fill':
                x = (fillColor.origin.x - paperLayer.position.x) / paperLayer.bounds.width;
                y = (fillColor.origin.y - paperLayer.position.y) / paperLayer.bounds.height;
                store.dispatch(setLayerFillGradientOrigin({id: state.selected[0], origin: {x, y}}));
                break;
              case 'stroke':
                x = (strokeColor.origin.x - paperLayer.position.x) / paperLayer.bounds.width;
                y = (strokeColor.origin.y - paperLayer.position.y) / paperLayer.bounds.height;
                store.dispatch(setLayerStrokeGradientOrigin({id: state.selected[0], origin: {x, y}}));
                break;
            }
            break;
          }
          case 'destination': {
            switch(this.prop) {
              case 'fill':
                x = (fillColor.destination.x - paperLayer.position.x) / paperLayer.bounds.width;
                y = (fillColor.destination.y - paperLayer.position.y) / paperLayer.bounds.height;
                store.dispatch(setLayerFillGradientDestination({id: state.selected[0], destination: {x, y}}));
                break;
              case 'stroke':
                x = (strokeColor.destination.x - paperLayer.position.x) / paperLayer.bounds.width;
                y = (strokeColor.destination.y - paperLayer.position.y) / paperLayer.bounds.height;
                store.dispatch(setLayerStrokeGradientDestination({id: state.selected[0], destination: {x, y}}));
                break;
            }
            break;
          }
        }
      }
      this.disable();
    }
  }
}

export default GradientTool;