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
  snapTool: SnapTool;
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
    this.snapTool = null;
  }
  updateOrigin(event: paper.ToolEvent, state: RootState): void {
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
  updateDestination(event: paper.ToolEvent, state: RootState): void {
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
  onKeyDown(event: paper.KeyEvent): void {
    this.insertTool.onKeyDown(event);
  }
  onKeyUp(event: paper.KeyEvent): void {
    this.insertTool.onKeyUp(event);
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      this.from = event.point;
      this.toBounds = new paperMain.Rectangle(this.fromBounds);
      this.snapTool.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => snapPoint.id === state.gradientEditor.layer);
      this.snapTool.snapBounds = this.toBounds;
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
        case 'origin': {
          this.updateOrigin(event, state);
          break;
        }
        case 'destination': {
          this.updateDestination(event, state);
          break;
        }
      }
      this.snapTool.updateGuides();
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