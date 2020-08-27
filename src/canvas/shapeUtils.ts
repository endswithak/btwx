import store from '../store';
import { openContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';

export const applyShapeMethods = (shape: paper.Item) => {
  shape.set({
    onMouseEnter: function(e: paper.MouseEvent) {
      const state = store.getState();
      if (!state.canvasSettings.selecting) {
        const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, this.data.id);
        store.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
      }
    },
    onMouseLeave: function(e: paper.MouseEvent) {
      const state = store.getState();
      if (!state.canvasSettings.selecting) {
        store.dispatch(setLayerHover({id: null}));
      }
    },
    onDoubleClick: function(e: paper.MouseEvent) {
      store.dispatch(deepSelectLayer({id: this.data.id}));
    },
    onMouseDown: function(e: any) {
      const state = store.getState();
      const layer = getLayer(state.layer.present, this.data.id);
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
      if (e.event.which === 3) {
        store.dispatch(openContextMenu({type: 'TweenEvent', id: nearestScopeAncestor.id, x: e.event.clientX, y: e.event.clientY}));
      }
      if (e.modifiers.shift) {
        if (layer.selected) {
          store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
        } else {
          store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
        }
      } else {
        if (!layer.selected) {
          if (nearestScopeAncestor.type === 'Artboard') {
            store.dispatch(deepSelectLayer({id: this.data.id}));
          } else {
            store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
          }
        }
      }
    }
  });
}