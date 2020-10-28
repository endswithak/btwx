import store from '../store';
import { setLayersGradientOrigin, setLayersGradientDestination } from '../store/actions/layer';
import { getPaperLayer, getGradientOriginPoint, getGradientDestinationPoint } from '../store/selectors/layer';
import { paperMain } from './index';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class GradientTool {
  state: RootState;
  handle: Btwx.GradientHandle;
  prop: Btwx.GradientProp;
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
  constructor(handle?: Btwx.GradientHandle, prop?: Btwx.GradientProp) {
    this.handle = handle;
    this.prop = prop;
    this.toBounds = null;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
    this.snapTool = new SnapTool();
    this.origin = null;
    this.destination = null;
  }
  updateOrigin(event: paper.ToolEvent, state: RootState): void {
    const layerItem = state.layer.present.byId[state.gradientEditor.layers[0]];
    const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
    const paperLayer = getPaperLayer(state.gradientEditor.layers[0]);
    const newOriginPoint = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: newOriginPoint,
      destination: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
    } as Btwx.PaperGradientFill
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
    })() as Btwx.PaperGradientFill;
    this.origin = {
      x: (style.origin.x - layerItem.frame.x) / (isLine ? layerItem.frame.width : layerItem.frame.innerWidth),
      y: (style.origin.y - layerItem.frame.y) / (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)
    }
    paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: getGradientOriginPoint(layerItem, this.origin),
      destination: (paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
    } as Btwx.PaperGradientFill
  }
  updateDestination(event: paper.ToolEvent, state: RootState): void {
    const layerItem = state.layer.present.byId[state.gradientEditor.layers[0]];
    const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
    const paperLayer = getPaperLayer(state.gradientEditor.layers[0]);
    const newDestinationPoint = new paperMain.Point(this.toBounds.center.x, this.toBounds.center.y);
    paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: (paperLayer[`${state.gradientEditor.prop}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
      destination: newDestinationPoint
    } as Btwx.PaperGradientFill
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
    })() as Btwx.PaperGradientFill;
    this.destination = {
      x: (style.destination.x - layerItem.frame.x) / (isLine ? layerItem.frame.width : layerItem.frame.innerWidth),
      y: (style.destination.y - layerItem.frame.y) / (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)
    }
    paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'].gradient,
      origin: (paperLayer[`${this.prop}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
      destination: getGradientDestinationPoint(layerItem, this.destination)
    } as Btwx.PaperGradientFill
  }
  onKeyDown(event: paper.KeyEvent): void {

  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseDown(event: paper.ToolEvent): void {
    this.from = event.point;
    this.originHandle = paperMain.project.getItem({data: {id: 'GradientFrameOriginHandle'}}) as paper.Shape;
    this.destinationHandle = paperMain.project.getItem({data: {id: 'GradientFrameDestinationHandle'}}) as paper.Shape;
    this.gradientLines = paperMain.project.getItems({data: {id: 'GradientFrameLine'}}) as paper.Path.Line[];
    this.fromBounds = new paperMain.Rectangle(this.handle === 'origin' ? this.originHandle.bounds : this.destinationHandle.bounds);
    this.toBounds = new paperMain.Rectangle(this.fromBounds);
    this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint) => snapPoint.id === this.state.gradientEditor.layers[0]);
    this.snapTool.snapBounds = this.toBounds;
  }
  onMouseDrag(event: paper.ToolEvent): void {
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
        this.updateOrigin(event, this.state);
        break;
      }
      case 'destination': {
        this.updateDestination(event, this.state);
        break;
      }
    }
    this.snapTool.updateGuides();
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.x !== 0 || this.y !== 0) {
      switch(this.handle) {
        case 'origin':
          store.dispatch(setLayersGradientOrigin({layers: this.state.layer.present.selected, prop: this.prop, origin: this.origin}));
          break;
        case 'destination':
          store.dispatch(setLayersGradientDestination({layers: this.state.layer.present.selected, prop: this.prop, destination: this.destination}));
          break;
      }
    }
    // store.dispatch(toggleGradientToolThunk(null, null) as any);
  }
}

export default GradientTool;