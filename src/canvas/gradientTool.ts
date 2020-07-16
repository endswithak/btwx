import store from '../store';
import { setLayerFillGradientOrigin, setLayerFillGradientDestination, setLayerStrokeGradientOrigin, setLayerStrokeGradientDestination } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import InsertTool from './insertTool';

class GradientTool {
  enabled: boolean;
  handle: 'origin' | 'destination';
  prop: 'fill' | 'stroke';
  insertTool: InsertTool;
  x: number;
  y: number;
  originHandle: paper.Shape;
  destinationHandle: paper.Shape;
  gradientLines: paper.Path.Line[];
  constructor() {
    this.handle = null;
    this.prop = null;
    this.enabled = false;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
  }
  enable(handle: 'origin' | 'destination', prop: 'fill' | 'stroke'): void {
    this.enabled = true;
    this.handle = handle;
    this.prop = prop;
    this.originHandle = paperMain.project.getItem({data: {id: 'gradientFrameOriginHandle'}}) as paper.Shape;
    this.destinationHandle = paperMain.project.getItem({data: {id: 'gradientFrameDestinationHandle'}}) as paper.Shape;
    this.gradientLines = paperMain.project.getItems({data: {id: 'gradientFrameLine'}}) as paper.Path.Line[];
  }
  disable(): void {
    this.enabled = false;
    this.handle = null;
    this.prop = null;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.insertTool.onKeyDown(event);
  }
  onKeyUp(event: paper.KeyEvent): void {
    this.insertTool.onKeyUp(event);
  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.x += event.delta.x;
    this.y += event.delta.y;
    const state = store.getState().layer.present;
    const paperLayer = getPaperLayer(state.selected[0]);
    const fillColor = paperLayer.fillColor as em.PaperGradientFill;
    const strokeColor = paperLayer.strokeColor as em.PaperGradientFill;
    let newOrigin;
    let newDestination;
    switch(this.handle) {
      case 'origin': {
        switch(this.prop) {
          case 'fill':
            newOrigin = new paperMain.Point(fillColor.origin.x + event.delta.x, fillColor.origin.y + event.delta.y);
            break;
          case 'stroke':
            newOrigin = new paperMain.Point(strokeColor.origin.x + event.delta.x, strokeColor.origin.y + event.delta.y);
            break;
        }
        this.originHandle.position.x += event.delta.x;
        this.originHandle.position.y += event.delta.y;
        this.gradientLines.forEach((line) => {
          line.firstSegment.point.x += event.delta.x;
          line.firstSegment.point.y += event.delta.y;
        });
        switch(this.prop) {
          case 'fill':
            paperLayer.fillColor = {
              gradient: fillColor.gradient,
              origin: newOrigin,
              destination: fillColor.destination
            } as em.PaperGradientFill
            break;
          case 'stroke':
            paperLayer.strokeColor = {
              gradient: strokeColor.gradient,
              origin: newOrigin,
              destination: strokeColor.destination
            } as em.PaperGradientFill
            break;
        }
        break;
      }
      case 'destination': {
        switch(this.prop) {
          case 'fill':
            newDestination = new paperMain.Point(fillColor.destination.x + event.delta.x, fillColor.destination.y + event.delta.y);
            break;
          case 'stroke':
            newDestination = new paperMain.Point(strokeColor.destination.x + event.delta.x, strokeColor.destination.y + event.delta.y);
            break;
        }
        this.destinationHandle.position.x += event.delta.x;
        this.destinationHandle.position.y += event.delta.y;
        this.gradientLines.forEach((line) => {
          line.lastSegment.point.x += event.delta.x;
          line.lastSegment.point.y += event.delta.y;
        });
        switch(this.prop) {
          case 'fill':
            paperLayer.fillColor = {
              gradient: fillColor.gradient,
              origin: fillColor.origin,
              destination: newDestination
            } as em.PaperGradientFill
            break;
          case 'stroke':
            paperLayer.strokeColor = {
              gradient: strokeColor.gradient,
              origin: strokeColor.origin,
              destination: newDestination
            } as em.PaperGradientFill
            break;
        }
        break;
      }
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