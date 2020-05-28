import paper, { Shape, Point, Path, Color, PointText } from 'paper';
import store, { StoreDispatch, StoreGetState } from '../store';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';

export const applyTextMethods = (text: paper.Item) => {
  text.onMouseEnter = function(e: paper.MouseEvent) {
    const state = store.getState();
    const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, this.data.id);
    store.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
  },
  text.onMouseLeave = function(e: paper.MouseEvent) {
    store.dispatch(setLayerHover({id: null}));
  },
  text.onDoubleClick = function(e: paper.MouseEvent) {
    store.dispatch(deepSelectLayer({id: this.data.id}));
  },
  text.onMouseDown = function(e: paper.MouseEvent) {
    const state = store.getState();
    const layer = getLayer(state.layer.present, this.data.id);
    const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
    if (e.event.which === 3) {
      if (nearestScopeAncestor.id === this.data.id) {
        store.dispatch(openContextMenu({type: 'TweenEvent', id: this.data.id, x: e.event.clientX, y: e.event.clientY}));
      }
    }
    if (e.modifiers.shift) {
      if (nearestScopeAncestor.type === 'Artboard') {
        if (layer.selected) {
          store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
        } else {
          store.dispatch(deepSelectLayer({id: this.data.id}));
          //store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
        }
      }
    } else {
      if (nearestScopeAncestor.type === 'Artboard') {
        store.dispatch(deepSelectLayer({id: this.data.id}));
      } else {
        store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
      }
    }
  }
}