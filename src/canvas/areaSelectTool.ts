import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getPaperLayer, getNearestScopeAncestor } from '../store/selectors/layer';
import { deselectAllLayers, deselectLayer, selectLayer } from '../store/actions/layer';
import store from '../store';
import { paperMain } from './index';

class AreaSelectTool {
  enabled: boolean;
  from: paper.Point;
  to: paper.Point;
  overlapped: string[];
  shape: paper.Path;
  shiftModifier: boolean;
  metaModifier: boolean;
  constructor() {
    this.enabled = false;
    this.from = null;
    this.to = null;
    this.shape = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.overlapped = [];
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    if (this.shape) {
      this.shape.remove();
    }
    this.to = null;
    this.from = null;
    this.shape = null;
    this.enabled = false;
    this.overlapped = [];
  }
  update(to: paper.Point) {
    this.to = to;
    this.shape = this.renderAreaSelectShape({});
  }
  renderAreaSelectShape(shapeOpts: any) {
    const selectAreaShape = new paperMain.Path.Rectangle({
      from: this.from,
      to: this.to,
      selected: true,
      ...shapeOpts
    });
    selectAreaShape.removeOn({
      drag: true,
      up: true
    });
    return selectAreaShape;
  }
  paperLayers() {
    const state = store.getState().layer;
    return getPagePaperLayer(state.present).getItems({
      data: (data: any) => {
        if (data.id === 'ArtboardBackground') {
          return true;
        } else {
          const topParent = getNearestScopeAncestor(state.present, data.id);
          return topParent.id === data.id;
        }
      },
      overlapping: this.shape.bounds
    });
  }
  layers() {
    const paperLayers = this.paperLayers();
    return paperLayers.map((paperLayer) => {
      if (paperLayer.data.id === 'ArtboardBackground') {
        return paperLayer.parent.data.id;
      } else {
        return paperLayer.data.id;
      }
    });
  }
  onEscape() {
    this.disable();
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      const state = store.getState();
      this.from = event.point;
      if (!this.shiftModifier) {
        if (state.layer.present.selected.length > 0) {
          store.dispatch(deselectAllLayers());
        }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.update(event.point);
      if (this.to) {
        const state = store.getState();
        const layers = this.layers();
        layers.forEach((id: string) => {
          if (!this.overlapped.includes(id)) {
            if (this.shiftModifier) {
              if (state.layer.present.selected.includes(id)) {
                store.dispatch(deselectLayer({id}));
              } else {
                store.dispatch(selectLayer({id}));
              }
            } else {
              store.dispatch(selectLayer({id}));
            }
            this.overlapped.push(id);
          }
        });
        this.overlapped.forEach((id: string) => {
          if (!layers.includes(id)) {
            if (this.shiftModifier) {
              if (state.layer.present.selected.includes(id)) {
                store.dispatch(deselectLayer({id}));
              } else {
                store.dispatch(selectLayer({id}));
              }
            } else {
              store.dispatch(deselectLayer({id}));
            }
            this.overlapped = this.overlapped.filter((layer) => layer !== id);
          }
        });
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.disable();
  }
}

export default AreaSelectTool;