import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { getPagePaperLayer, getLayerByPaperId, getTopParentGroup } from '../store/selectors/layer';
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
    const selectAreaShape = new Path.Rectangle({
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
    const state = this.getState().layer;
    return getPagePaperLayer(state).getItems({
      id: (paperId: number) => {
        const layerId = getLayerByPaperId(state, paperId).id;
        const topParent = getTopParentGroup(state, layerId);
        return topParent.paperLayer === paperId;
      },
      overlapping: this.shape.bounds
    });
  }
  layers() {
    const state = this.getState().layer;
    const paperLayers = this.paperLayers();
    return paperLayers.map((paperLayer) => {
      return getLayerByPaperId(state, paperLayer.id).id;
    });
  }
}

export default AreaSelect;