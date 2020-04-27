import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getActivePagePaperLayer, getLayerByPaperId, getTopParentGroup } from '../store/selectors/layers';
import store, { StoreGetState, StoreDispatch } from '../store';

class AreaSelect {
  getState: StoreGetState;
  dispatch: StoreDispatch;
  from: paper.Point;
  to: paper.Point;
  shape: paper.Path;
  constructor(from: paper.Point) {
    this.getState = store.getState;
    this.dispatch = store.dispatch;
    this.from = from;
    this.to = null;
    this.shape = null;
  }
  clear() {
    if (this.shape) {
      this.shape.remove();
    }
    this.to = null;
    this.from = null;
    this.shape = null;
  }
  update(to: paper.Point) {
    this.to = to;
    this.shape = this.renderAreaSelectShape({});
  }
  renderAreaSelectShape(shapeOpts: any) {
    if (this.shape) {
      this.shape.remove();
    }
    return new Path.Rectangle({
      from: this.from,
      to: this.to,
      selected: true,
      ...shapeOpts
    });
  }
  paperLayers() {
    const state = this.getState().layers;
    return getActivePagePaperLayer(state).getItems({
      id: (paperId: number) => {
        const layerId = getLayerByPaperId(state, paperId).id;
        const topParent = getTopParentGroup(state, layerId);
        return topParent.paperLayer === paperId;
      },
      overlapping: this.shape.bounds
    });
  }
  layers() {
    const state = this.getState().layers;
    const paperLayers = this.paperLayers();
    return paperLayers.map((paperLayer) => {
      return getLayerByPaperId(state, paperLayer.id).id;
    });
  }
}

export default AreaSelect;