import paper, { Shape, Point, Path, Color, PointText } from 'paper';
import store, { StoreDispatch, StoreGetState } from '../store';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';

export const applyArtboardMethods = (artboard: paper.Item) => {
  artboard.onMouseDown = function(e: paper.MouseEvent) {
    console.log(this);
    const state = store.getState();
    const layer = getLayer(state.layer.present, this.data.artboard);
    const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
    //store.dispatch(setActiveArtboard({id: this.data.artboard}));
    if (e.event.which === 3) {
      if (nearestScopeAncestor.id === this.data.artboard) {
        store.dispatch(openContextMenu({type: 'AnimationEventSelect', id: this.data.artboard, x: e.event.clientX, y: e.event.clientY}));
      }
    }
    if (e.modifiers.shift) {
      if (layer.selected) {
        store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
      } else {
        store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
      }
    } else {
      if (!state.layer.present.selected.includes(nearestScopeAncestor.id)) {
        store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
      }
    }
  }
}