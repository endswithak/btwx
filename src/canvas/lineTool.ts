import store from '../store';
import { setCurvePointOrigin } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import InsertTool from './insertTool';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';
import { updateSelectionFrame } from '../store/utils/layer';
import { setCanvasResizing } from '../store/actions/canvasSettings';

class LineTool {
  state: RootState;
  enabled: boolean;
  handle: 'from' | 'to';
  from: paper.Point;
  to: paper.Point;
  toBounds: paper.Rectangle;
  fromBounds: paper.Rectangle;
  x: number;
  y: number;
  fromHandle: paper.Shape;
  toHandle: paper.Shape;
  gradientLines: paper.Path.Line[];
  snapTool: SnapTool;
  constructor() {
    this.handle = null;
    this.enabled = false;
    this.toBounds = null;
    this.fromBounds = null;
    this.x = 0;
    this.y = 0;
    this.fromHandle = null;
    this.toHandle = null;
    this.snapTool = null;
  }
  enable(state: RootState, handle: 'from' | 'to'): void {
    // store.dispatch(setCanvasResizing({resizing: true}));
    this.state = state;
    this.enabled = true;
    this.handle = handle;
    this.fromHandle = paperMain.project.getItem({data: {id: 'selectionFrameHandle', handle: 'from'}}) as paper.Shape;
    this.toHandle = paperMain.project.getItem({data: {id: 'selectionFrameHandle', handle: 'to'}}) as paper.Shape;
    this.fromBounds = new paperMain.Rectangle(handle === 'from' ? this.fromHandle.bounds : this.toHandle.bounds);
    this.snapTool = new SnapTool();
    updateSelectionFrame(this.state.layer.present, this.handle);
  }
  disable(): void {
    // store.dispatch(setCanvasResizing({resizing: false}));
    this.state = null;
    this.enabled = false;
    this.handle = null;
    this.toBounds = null;
    this.fromBounds = null;
    this.x = 0;
    this.y = 0;
    this.fromHandle = null;
    this.toHandle = null;
    this.snapTool = null;
  }
  updateFrom(): void {
    const paperLayer = getPaperLayer(this.state.layer.present.selected[0]) as paper.Path;
    const newFrom = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer.segments[0].point = newFrom;
    this.fromHandle.bounds.center.x = newFrom.x;
    this.fromHandle.bounds.center.y = newFrom.y;
  }
  updateTo(): void {
    const paperLayer = getPaperLayer(this.state.layer.present.selected[0]) as paper.Path;
    const newTo = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer.segments[1].point = newTo;
    this.toHandle.bounds.center.x = newTo.x;
    this.toHandle.bounds.center.y = newTo.y;
  }
  // onKeyDown(event: paper.KeyEvent): void {
  //   this.insertTool.onKeyDown(event);
  // }
  // onKeyUp(event: paper.KeyEvent): void {
  //   this.insertTool.onKeyUp(event);
  // }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.from = event.point;
      this.toBounds = new paperMain.Rectangle(this.fromBounds);
      this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint) => snapPoint.id !== this.state.layer.present.selected[0]);
      this.snapTool.snapBounds = this.toBounds;
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.to = event.point;
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.toBounds.center.x = this.fromBounds.center.x + this.x;
      this.toBounds.center.y = this.fromBounds.center.y + this.y;
      this.snapTool.snapBounds = this.toBounds;
      this.snapTool.updateXSnap({
        event: event,
        snapTo: {
          left: false,
          right: false,
          center: true
        },
        handleSnapped: (snapPoint) => {
          this.toBounds.center.x = snapPoint.point;
        },
        handleSnap: (closestXSnap) => {
          this.toBounds.center.x = closestXSnap.snapPoint.point;
        }
      });
      this.snapTool.updateYSnap({
        event: event,
        snapTo: {
          top: false,
          bottom: false,
          center: true
        },
        handleSnapped: (snapPoint) => {
          this.toBounds.center.y = snapPoint.point;
        },
        handleSnap: (closestYSnap) => {
          this.toBounds.center.y = closestYSnap.snapPoint.point;
        }
      });
      switch(this.handle) {
        case 'from': {
          this.updateFrom();
          break;
        }
        case 'to': {
          this.updateTo();
          break;
        }
      }
      updateSelectionFrame(this.state.layer.present, this.handle);
      this.snapTool.updateGuides();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x !== 0 || this.y !== 0) {
        const state = store.getState().layer.present;
        const layerItem = state.byId[state.selected[0]] as em.Shape;
        const pointIndex = this.handle === 'from' ? 0 : 1;
        store.dispatch(setCurvePointOrigin({id: state.selected[0], pointId: layerItem.path.points.allIds[pointIndex], x: this.to.x, y: this.to.y}));
      }
      this.disable();
    }
  }
}

export default LineTool;