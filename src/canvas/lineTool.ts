import store from '../store';
import { setLineFrom, setLineTo } from '../store/actions/layer';
import { getPaperLayer, getLineFromPoint, getLineToPoint } from '../store/selectors/layer';
import { paperMain } from './index';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';
import { updateSelectionFrame } from '../store/utils/layer';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { isBetween } from '../utils';

class LineTool {
  state: RootState;
  enabled: boolean;
  handle: 'from' | 'to';
  from: paper.Point;
  to: paper.Point;
  vector: paper.Point;
  toBounds: paper.Rectangle;
  fromBounds: paper.Rectangle;
  x: number;
  y: number;
  fromHandle: paper.Shape;
  toHandle: paper.Shape;
  snapTool: SnapTool;
  shiftModifier: boolean;
  isHorizontal: boolean;
  isVertical: boolean;
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
    this.shiftModifier = false;
    this.isHorizontal = false;
    this.isVertical = false;
  }
  enable(state: RootState, handle: 'from' | 'to'): void {
    this.state = state;
    this.enabled = true;
    this.handle = handle;
    this.fromHandle = paperMain.project.getItem({data: {id: 'selectionFrameHandle', handle: 'from'}}) as paper.Shape;
    this.toHandle = paperMain.project.getItem({data: {id: 'selectionFrameHandle', handle: 'to'}}) as paper.Shape;
    this.fromBounds = new paperMain.Rectangle(handle === 'from' ? this.fromHandle.bounds : this.toHandle.bounds);
    this.snapTool = new SnapTool();
    store.dispatch(setCanvasResizing({resizing: true, resizingType: 'ew'}));
    updateSelectionFrame(this.state.layer.present, this.handle);
  }
  disable(): void {
    store.dispatch(setCanvasResizing({resizing: false}));
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
  updateHandles(): void {
    const paperLayer = getPaperLayer(this.state.layer.present.selected[0]) as paper.CompoundPath;
    switch(this.handle) {
      case 'to': {
        const newTo = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
        (paperLayer.children[0] as paper.Path).lastSegment.point = newTo;
        this.toHandle.bounds.center.x = newTo.x;
        this.toHandle.bounds.center.y = newTo.y;
        break;
      }
      case 'from': {
        const newFrom = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
        (paperLayer.children[0] as paper.Path).firstSegment.point = newFrom;
        this.fromHandle.bounds.center.x = newFrom.x;
        this.fromHandle.bounds.center.y = newFrom.y;
        break;
      }
    }
  }
  updateToBounds(): void {
    const x = this.snapTool.snap.x ? this.snapTool.snap.x.point : this.fromBounds.center.x + this.x;
    const y = this.snapTool.snap.y ? this.snapTool.snap.y.point : this.fromBounds.center.y + this.y;
    if (this.shiftModifier) {
      const layerItem = this.state.layer.present.byId[this.state.layer.present.selected[0]] as em.Line;
      const toPoint = getLineToPoint(layerItem);
      const fromPoint = getLineFromPoint(layerItem);
      if (this.isHorizontal) {
        switch(this.handle) {
          case 'to':
            this.toBounds.center.x = x;
            this.toBounds.center.y = fromPoint.y;
            break;
          case 'from':
            this.toBounds.center.x = x;
            this.toBounds.center.y = toPoint.y;
            break;
        }
      }
      if (this.isVertical) {
        switch(this.handle) {
          case 'to':
            this.toBounds.center.x = fromPoint.x;
            this.toBounds.center.y = y;
            break;
          case 'from':
            this.toBounds.center.x = toPoint.x;
            this.toBounds.center.y = y;
            break;
        }
      }
    } else {
      this.toBounds.center.x = x;
      this.toBounds.center.y = y;
    }
    this.snapTool.snapBounds = this.toBounds;
  }
  updateVector(): void {
    switch(this.handle) {
      case 'from': {
        const toPoint = this.toHandle.position;
        this.vector = toPoint.subtract(this.to);
        break;
      }
      case 'to': {
        const fromPoint = this.fromHandle.position;
        this.vector = fromPoint.subtract(this.to);
        break;
      }
    }
    this.isHorizontal = this.shiftModifier && (isBetween(this.vector.angle, 0, 45) || isBetween(this.vector.angle, -45, 0) || isBetween(this.vector.angle, 135, 180) || isBetween(this.vector.angle, -180, -135));
    this.isVertical = this.shiftModifier && (isBetween(this.vector.angle, -90, -45) || isBetween(this.vector.angle, -135, -90) || isBetween(this.vector.angle, 45, 90) || isBetween(this.vector.angle, 90, 135));
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        if (this.enabled) {
          this.updateVector();
          this.updateToBounds();
          this.updateHandles();
          updateSelectionFrame(this.state.layer.present, this.handle);
          this.snapTool.updateGuides();
        }
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        if (this.enabled) {
          this.updateVector();
          this.updateToBounds();
          this.updateHandles();
          updateSelectionFrame(this.state.layer.present, this.handle);
          this.snapTool.updateGuides();
        }
        break;
      }
    }
  }
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
      this.state = store.getState();
      this.to = event.point;
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.snapTool.updateXSnap({
        event: event,
        snapTo: {
          left: false,
          right: false,
          center: true
        }
      });
      this.snapTool.updateYSnap({
        event: event,
        snapTo: {
          top: false,
          bottom: false,
          center: true
        }
      });
      this.updateVector();
      this.updateToBounds();
      this.updateHandles();
      updateSelectionFrame(this.state.layer.present, this.handle);
      this.snapTool.updateGuides();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x !== 0 || this.y !== 0) {
        const paperLayer = getPaperLayer(this.state.layer.present.selected[0]) as paper.CompoundPath;
        const newX = (this.to.x - (paperLayer.children[0] as paper.Path).position.x) / this.vector.length;
        const newY = (this.to.y - (paperLayer.children[0] as paper.Path).position.y) / this.vector.length;
        switch(this.handle) {
          case 'from': {
            store.dispatch(setLineFrom({id: this.state.layer.present.selected[0], x: newX, y: newY}));
            break;
          }
          case 'to': {
            store.dispatch(setLineTo({id: this.state.layer.present.selected[0], x: newX, y: newY}));
            break;
          }
        }
      }
      this.disable();
    }
  }
}

export default LineTool;