import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getNearestScopeAncestor } from '../store/selectors/layer';
import { deselectAllLayers, deselectLayer, selectLayer } from '../store/actions/layer';
import { setCanvasSelecting } from '../store/actions/canvasSettings';
import store from '../store';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR } from '../constants';
import { LayerState } from '../store/reducers/layer';
import { RootState } from '../store/reducers';

class AreaSelectTool {
  state: RootState;
  enabled: boolean;
  from: paper.Point;
  to: paper.Point;
  overlapped: string[];
  shape: paper.Path;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    this.state = null;
    this.enabled = false;
    this.from = null;
    this.to = null;
    this.shape = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
    this.overlapped = [];
  }
  enable(state: RootState) {
    this.enabled = true;
    this.state = state;
    store.dispatch(setCanvasSelecting({selecting: true}));
  }
  disable() {
    store.dispatch(setCanvasSelecting({selecting: false}));
    if (this.shape) {
      this.shape.remove();
    }
    this.to = null;
    this.from = null;
    this.shape = null;
    this.enabled = false;
    this.overlapped = [];
    this.state = null;
  }
  update(to: paper.Point) {
    this.to = to;
    this.shape = this.renderAreaSelectShape({});
  }
  renderAreaSelectShape(shapeOpts: any) {
    if (this.shape) {
      this.shape.remove();
    }
    const selectAreaShape = new paperMain.Path.Rectangle({
      from: this.from,
      to: this.to,
      fillColor: new paper.Color(THEME_PRIMARY_COLOR),
      opacity: 0.5,
      ...shapeOpts
    });
    selectAreaShape.removeOn({
      up: true
    });
    return selectAreaShape;
  }
  hitTestLayers() {
    const layers: string[] = [];
    // get overlapped page layers
    const overlappedLayers = getPagePaperLayer(this.state.layer.present).getItems({
      data: (data: any) => {
        if (data.id !== 'ArtboardBackground' && data.id !== 'ArtboardMask' && data.id !== 'Raster') {
          const topParent = getNearestScopeAncestor(this.state.layer.present, data.id);
          return topParent.id === data.id;
        }
      },
      overlapping: this.shape.bounds
    });
    // add fully overlapped artboards, overlapped children of
    // partially overlapped artboards, and overlapped page layers
    // to final layers array
    overlappedLayers.forEach((item: paper.Item) => {
      if (item.data.type === 'Artboard') {
        if (item.isInside(this.shape.bounds)) {
          layers.push(item.data.id);
        } else {
          item.getItems({
            data: (data: any) => {
              if (data.id !== 'ArtboardBackground' && data.id !== 'ArtboardMask' && data.id !== 'Raster') {
                if (this.state.layer.present.byId[item.data.id].children.includes(data.id)) {
                  layers.push(data.id);
                }
              }
            },
            overlapping: this.shape.bounds
          });
        }
      } else {
        layers.push(item.data.id);
      }
    });
    // return final layers array
    return layers;
  }
  onKeyDown(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'alt': {
        this.altModifier = true;
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      // set from point
      this.from = event.point;
      // deselect all if layers if no shift modifier
      if (!this.shiftModifier) {
        if (this.state.layer.present.selected.length > 0) {
          store.dispatch(deselectAllLayers());
        }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      // update to point and area select shape
      this.update(event.point);
      if (this.to) {
        // get hit test layers
        const hitTestLayers = this.hitTestLayers();
        // loop through hit test layers
        hitTestLayers.forEach((id: string) => {
          // process layer if not included in overlapped
          if (!this.overlapped.includes(id)) {
            // if shift modifier, add or remove layer from selected
            if (this.shiftModifier) {
              if (this.state.layer.present.selected.includes(id)) {
                store.dispatch(deselectLayer({id}));
              } else {
                store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
              }
            }
            // else, add layer to selected
            else {
              store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
            }
            // push layer id to overlapped
            this.overlapped.push(id);
          }
        });
        // loop through overlapped
        this.overlapped.forEach((id: string) => {
          // process layer if not included in hitTestLayers
          if (!hitTestLayers.includes(id)) {
            // if shift modifier, add or remove layer from selected
            if (this.shiftModifier) {
              if (this.state.layer.present.selected.includes(id)) {
                store.dispatch(deselectLayer({id}));
              } else {
                store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
              }
            }
            // else, remove layer from selected
            else {
              store.dispatch(deselectLayer({id}));
            }
            // remove layer from overlapped
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