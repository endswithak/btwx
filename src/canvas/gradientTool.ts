import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { v4 as uuidv4 } from 'uuid';
import store from '../store';
import { openTextEditor } from '../store/actions/textEditor';
import { setLayerFillGradientOrigin, setLayerFillGradientDestination } from '../store/actions/layer';
import { getNearestScopeAncestor, getPaperLayer, getPagePaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import { applyTextMethods } from './textUtils';
import { DEFAULT_TEXT_VALUE, DEFAULT_STYLE } from '../constants';
import InsertTool from './insertTool';
//import textSettings from 'src/store/reducers/textSettings';

class GradientTool {
  enabled: boolean;
  handle: 'origin' | 'destination';
  insertTool: InsertTool;
  x: number;
  y: number;
  originHandle: paper.Shape;
  destinationHandle: paper.Shape;
  gradientLines: paper.Path.Line[];
  constructor() {
    this.handle = null;
    this.enabled = false;
    this.x = 0;
    this.y = 0;
    this.originHandle = null;
    this.destinationHandle = null;
    this.gradientLines = null;
  }
  enable(handle: 'origin' | 'destination') {
    this.enabled = true;
    this.handle = handle;
    this.originHandle = paperMain.project.getItem({data: {id: 'gradientEditorHandle', handle: 'origin'}}) as paper.Shape;
    this.destinationHandle = paperMain.project.getItem({data: {id: 'gradientEditorHandle', handle: 'destination'}}) as paper.Shape;
    this.gradientLines = paperMain.project.getItems({data: {id: 'gradientEditorLine'}}) as paper.Path.Line[];
  }
  disable() {
    this.enabled = false;
    this.handle = null;
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
    switch(this.handle) {
      case 'origin': {
        const newOrigin = new paperMain.Point(paperLayer.fillColor.origin.x + event.delta.x, paperLayer.fillColor.origin.y + event.delta.y);
        this.originHandle.position.x += event.delta.x;
        this.originHandle.position.y += event.delta.y;
        this.gradientLines.forEach((line) => {
          line.firstSegment.point.x += event.delta.x;
          line.firstSegment.point.y += event.delta.y;
        });
        paperLayer.fillColor = {
          gradient: paperLayer.fillColor.gradient,
          origin: newOrigin,
          destination: paperLayer.fillColor.destination
        }
        break;
      }
      case 'destination': {
        const newDestination = new paperMain.Point(paperLayer.fillColor.destination.x + event.delta.x, paperLayer.fillColor.destination.y + event.delta.y);
        this.destinationHandle.position.x += event.delta.x;
        this.destinationHandle.position.y += event.delta.y;
        this.gradientLines.forEach((line) => {
          line.lastSegment.point.x += event.delta.x;
          line.lastSegment.point.y += event.delta.y;
        });
        paperLayer.fillColor = {
          gradient: paperLayer.fillColor.gradient,
          origin: paperLayer.fillColor.origin,
          destination: newDestination
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
        switch(this.handle) {
          case 'origin': {
            const x = (paperLayer.fillColor.origin.x - paperLayer.position.x) / paperLayer.bounds.width;
            const y = (paperLayer.fillColor.origin.y - paperLayer.position.y) / paperLayer.bounds.height;
            store.dispatch(setLayerFillGradientOrigin({id: state.selected[0], origin: {x, y}}));
            break;
          }
          case 'destination': {
            const x = (paperLayer.fillColor.destination.x - paperLayer.position.x) / paperLayer.bounds.width;
            const y = (paperLayer.fillColor.destination.y - paperLayer.position.y) / paperLayer.bounds.height;
            store.dispatch(setLayerFillGradientDestination({id: state.selected[0], destination: {x, y}}));
            break;
          }
        }
      }
      this.disable();
    }
  }
}

export default GradientTool;