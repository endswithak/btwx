import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool } from '../store/actions/tool';
import { addShape, setLayerHover, increaseLayerScope, selectLayer, newLayerScope, deselectLayer, moveLayerBy, moveLayersBy, enableLayerDrag, disableLayerDrag } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';

class ResizeTool {
  enabled: boolean;
  x: number;
  y: number;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  enable(handle: string) {
    this.enabled = true;
    this.handle = handle;
  }
  disable() {
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.handle = null;
  }
  onEscape() {
    if (this.enabled) {

    }
    this.disable();
  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      if (this.x || this.y) {
        if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
          paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
        }
        if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
          paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
        }
      }
      if (state.layer.present.selected.length > 0) {
        this.x += event.delta.x;
        this.y += event.delta.y;
        state.layer.present.selected.forEach((layer) => {
          const layerItem = state.layer.present.byId[layer];
          const paperLayer = getPaperLayer(layer);
          if (this.shiftModifier) {
            switch(this.handle) {
              case 'topLeft': {
                paperLayer.bounds.width -= event.delta.x;
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                paperLayer.position.x += event.delta.x;
                break;
              }
              case 'topCenter': {
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.bounds.width -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                break;
              }
              case 'topRight': {
                paperLayer.bounds.width += event.delta.x;
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                break;
              }
              case 'bottomLeft': {
                paperLayer.bounds.width -= event.delta.x;
                paperLayer.bounds.height += event.delta.y;
                paperLayer.position.x += event.delta.x;
                break;
              }
              case 'bottomCenter': {
                paperLayer.bounds.height += event.delta.y;
                paperLayer.bounds.width += event.delta.y;
                break;
              }
              case 'bottomRight': {
                paperLayer.bounds.width += event.delta.x;
                paperLayer.bounds.height += event.delta.y;
                break;
              }
              case 'leftCenter': {
                paperLayer.bounds.width -= event.delta.x;
                paperLayer.bounds.height -= event.delta.x;
                paperLayer.position.x += event.delta.x;
                break;
              }
              case 'rightCenter': {
                paperLayer.bounds.width += event.delta.x;
                paperLayer.bounds.height += event.delta.x;
                break;
              }
            }
          } else {
            switch(this.handle) {
              case 'topLeft': {
                paperLayer.bounds.width -= event.delta.x;
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                paperLayer.position.x += event.delta.x;
                break;
              }
              case 'topCenter': {
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                break;
              }
              case 'topRight': {
                paperLayer.bounds.width += event.delta.x;
                paperLayer.bounds.height -= event.delta.y;
                paperLayer.position.y += event.delta.y;
                break;
              }
              case 'bottomLeft': {
                paperLayer.bounds.width -= event.delta.x;
                paperLayer.bounds.height += event.delta.y;
                paperLayer.position.x += event.delta.x;
                break;
              }
              case 'bottomCenter': {
                paperLayer.bounds.height += event.delta.y;
                break;
              }
              case 'bottomRight': {
                paperLayer.bounds.width += event.delta.x;
                paperLayer.bounds.height += event.delta.y;
                break;
              }
              case 'leftCenter': {
                if (this.x > layerItem.frame.width) {
                  paperLayer.scale(-1, 1);
                  paperLayer.bounds.width += event.delta.x;
                } else {
                  paperLayer.scale(1, 1);
                  paperLayer.bounds.width -= event.delta.x;
                  paperLayer.position.x += event.delta.x;
                }
                break;
              }
              case 'rightCenter': {
                paperLayer.bounds.width += event.delta.x;
                break;
              }
            }
          }

        });
        updateSelectionFrame(state.layer.present);
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {

    }
    this.disable();
  }
}

export default ResizeTool;