import store from '../store';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';
import { handleLayerScroll } from './utils';

export const applyShapeMethods = (shape: paper.Item) => {
  // shape.set({
  //   onMouseEnter: function(e: paper.MouseEvent) {
  //     const state = store.getState();
  //     if (!state.canvasSettings.selecting) {
  //       const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, this.data.id);
  //       store.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
  //     }
  //   },
  //   onMouseLeave: function(e: paper.MouseEvent) {
  //     const state = store.getState();
  //     if (!state.canvasSettings.selecting) {
  //       store.dispatch(setLayerHover({id: null}));
  //     }
  //   },
  //   onDoubleClick: function(e: paper.MouseEvent) {
  //     store.dispatch(deepSelectLayer({id: this.data.id}));
  //   },
  //   onMouseDown: function(e: any) {
  //     let state = store.getState();
  //     const layer = getLayer(state.layer.present, this.data.id);
  //     let nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
  //     if (e.event.which === 3) {
  //       if (state.contextMenu.isOpen) {
  //         store.dispatch(closeContextMenu());
  //       }
  //       if (!layer.selected) {
  //         if (nearestScopeAncestor.type === 'Artboard') {
  //           store.dispatch(deepSelectLayer({id: this.data.id}));
  //         } else {
  //           store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
  //         }
  //       }
  //       state = store.getState();
  //       nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
  //       store.dispatch(openContextMenu({type: 'LayerEdit', id: nearestScopeAncestor.id, x: e.event.clientX, y: e.event.clientY, paperX: e.point.x, paperY: e.point.y}));
  //       handleLayerScroll(nearestScopeAncestor.id);
  //     } else {
  //       if (e.modifiers.shift) {
  //         if (layer.selected) {
  //           store.dispatch(deselectLayer({id: nearestScopeAncestor.id}));
  //         } else {
  //           store.dispatch(selectLayer({id: nearestScopeAncestor.id}));
  //         }
  //       } else {
  //         if (!layer.selected) {
  //           if (nearestScopeAncestor.type === 'Artboard') {
  //             store.dispatch(deepSelectLayer({id: this.data.id}));
  //             state = store.getState();
  //             nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
  //           } else {
  //             store.dispatch(selectLayer({id: nearestScopeAncestor.id, newSelection: true}));
  //           }
  //           handleLayerScroll(nearestScopeAncestor.id);
  //         }
  //       }
  //     }
  //   }
  // });
}