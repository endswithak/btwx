import store from '../store';
import { setLayersGradientOrigin, setLayersGradientDestination } from '../store/actions/layer';
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
  origin: {
    x: number;
    y: number;
  }
  destination: {
    x: number;
    y: number;
  }
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
    this.origin = null;
    this.destination = null;
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
    this.origin = null;
    this.destination = null;
  }
  updateOrigin(event: paper.ToolEvent, state: RootState): void {
    const layerItem = state.layer.present.byId[state.gradientEditor.layers[0]];
    const isLine = layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Line';
    const paperLayer = getPaperLayer(state.gradientEditor.layers[0]);
    const newOriginPoint = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: newOriginPoint,
      destination: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).destination
    } as em.PaperGradientFill
    this.originHandle.bounds.center.x = newOriginPoint.x;
    this.originHandle.bounds.center.y = newOriginPoint.y;
    this.gradientLines.forEach((line) => {
      line.firstSegment.point.x = newOriginPoint.x;
      line.firstSegment.point.y = newOriginPoint.y;
    });
    const style = (() => {
      switch(this.prop) {
        case 'fill':
          return paperLayer.fillColor;
        case 'stroke':
          return paperLayer.strokeColor;
      }
    })() as em.PaperGradientFill;
    this.origin = {
      x: (style.origin.x - layerItem.frame.x) / (isLine ? layerItem.frame.width : layerItem.frame.innerWidth),
      y: (style.origin.y - layerItem.frame.y) / (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)
    }
    state.gradientEditor.layers.forEach((id, index) => {
      const paperLayer = getPaperLayer(id);
      paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] = {
        gradient: paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
        origin: getGradientOriginPoint(layerItem, this.origin),
        destination: (paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).destination
      } as em.PaperGradientFill
    });
  }
  updateDestination(event: paper.ToolEvent, state: RootState): void {
    const layerItem = state.layer.present.byId[state.gradientEditor.layers[0]];
    const isLine = layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Line';
    const paperLayer = getPaperLayer(state.gradientEditor.layers[0]);
    const newDestinationPoint = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).origin,
      destination: newDestinationPoint
    } as em.PaperGradientFill
    this.destinationHandle.bounds.center.x = newDestinationPoint.x;
    this.destinationHandle.bounds.center.y = newDestinationPoint.y;
    this.gradientLines.forEach((line) => {
      line.lastSegment.point.x = newDestinationPoint.x;
      line.lastSegment.point.y = newDestinationPoint.y;
    });
    const style = (() => {
      switch(this.prop) {
        case 'fill':
          return paperLayer.fillColor;
        case 'stroke':
          return paperLayer.strokeColor;
      }
    })() as em.PaperGradientFill;
    this.destination = {
      x: (style.destination.x - layerItem.frame.x) / (isLine ? layerItem.frame.width : layerItem.frame.innerWidth),
      y: (style.destination.y - layerItem.frame.y) / (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)
    }
    state.gradientEditor.layers.forEach((id, index) => {
      const paperLayer = getPaperLayer(id);
      paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] = {
        gradient: paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
        origin: (paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).origin,
        destination: getGradientDestinationPoint(layerItem, this.destination)
      } as em.PaperGradientFill
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
      this.snapTool.snapPoints = state.layer.present.inView.snapPoints.filter((snapPoint) => snapPoint.id === state.gradientEditor.layers[0]);
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
        switch(this.handle) {
          case 'origin':
            store.dispatch(setLayersGradientOrigin({layers: state.selected, prop: this.prop, origin: this.origin}));
            break;
          case 'destination':
            store.dispatch(setLayersGradientDestination({layers: state.selected, prop: this.prop, destination: this.destination}));
            break;
        }
      }
      this.disable();
    }
  }
}

export default GradientTool;