import store from '../store';
import { openContextMenu } from '../store/actions/contextMenu';
import { selectLayer, deselectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';

export const applyArtboardMethods = (artboard: paper.Item) => {
  const background = artboard.getItem({ data: { id: 'ArtboardBackground' } });
  background.set({
    onMouseDown: function(e: any) {
      const state = store.getState();
      const layer = getLayer(state.layer.present, this.parent.data.id);
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
      if (e.event.which === 3) {
        if (nearestScopeAncestor.id === this.parent.data.id) {
          store.dispatch(openContextMenu({type: 'TweenEvent', id: this.parent.data.id, x: e.event.clientX, y: e.event.clientY}));
        }
      }
      if (e.modifiers.shift) {
        if (layer.selected) {
          store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
        } else {
          store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
        }
      } else {
        if (!nearestScopeAncestor.selected) {
          store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
        }
      }
    }
  });
}