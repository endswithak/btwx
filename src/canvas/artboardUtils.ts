import store from '../store';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { selectLayer, deselectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';
import { handleLayerScroll } from './utils';

export const applyArtboardMethods = (artboard: paper.Item) => {
  // const background = artboard.getItem({ data: { id: 'ArtboardBackground' } });
  // background.set({
  //   onMouseDown: function(e: any) {
  //     let state = store.getState();
  //     const layer = getLayer(state.layer.present, this.parent.data.id);
  //     let nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
  //     if (e.event.which === 3) {
  //       if (state.contextMenu.isOpen) {
  //         store.dispatch(closeContextMenu());
  //       }
  //       if (!nearestScopeAncestor.selected) {
  //         store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
  //       }
  //       state = store.getState();
  //       nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
  //       handleLayerScroll(nearestScopeAncestor.id);
  //       if (nearestScopeAncestor.id === this.parent.data.id) {
  //         store.dispatch(openContextMenu({type: 'LayerEdit', id: this.parent.data.id, x: e.event.clientX, y: e.event.clientY, paperX: e.point.x, paperY: e.point.y}));
  //       }
  //     } else {
  //       if (e.modifiers.shift) {
  //         if (layer.selected) {
  //           store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
  //         } else {
  //           store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
  //         }
  //       } else {
  //         if (!nearestScopeAncestor.selected) {
  //           handleLayerScroll(nearestScopeAncestor.id);
  //           store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
  //         }
  //       }
  //     }
  //   }
  // });
}