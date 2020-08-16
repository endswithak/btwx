import paper, { Shape, Point, Path, Color, PointText } from 'paper';
import store, { StoreDispatch, StoreGetState } from '../store';
import { disableSelectionTool } from '../store/actions/tool';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { openTextEditor } from '../store/actions/textEditor';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayer } from '../store/selectors/layer';
import { SetTextSettingsPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettings } from '../store/actions/textSettings';
import { paperMain } from './';

export const applyTextMethods = (text: paper.Item) => {
  text.set({
    onMouseEnter: function(e: paper.MouseEvent) {
      const state = store.getState();
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, this.data.id);
      store.dispatch(setLayerHover({id: nearestScopeAncestor.id}));
    },
    onMouseLeave: function(e: paper.MouseEvent) {
      store.dispatch(setLayerHover({id: null}));
    },
    onDoubleClick: function(e: paper.MouseEvent) {
      const state = store.getState();
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, this.data.id);
      if (nearestScopeAncestor.id === this.data.id) {
        const topLeft = paperMain.view.projectToView(this.bounds.topLeft);
        const topCenter = paperMain.view.projectToView(this.bounds.topCenter);
        const topRight = paperMain.view.projectToView(this.bounds.topRight);
        store.dispatch(openTextEditor({
          layer: this.data.id,
          x: (() => {
            switch(state.textSettings.justification) {
              case 'left':
                return topLeft.x;
              case 'center':
                return topCenter.x;
              case 'right':
                return topRight.x;
            }
          })(),
          y: (() => {
            switch(state.textSettings.justification) {
              case 'left':
                return topLeft.y;
              case 'center':
                return topCenter.y;
              case 'right':
                return topRight.y;
            }
          })()
        }));
      } else {
        store.dispatch(deepSelectLayer({id: this.data.id}));
      }
    },
    onMouseDown: function(e: any) {
      const state = store.getState();
      const layer = getLayer(state.layer.present, this.data.id);
      const nearestScopeAncestor = getNearestScopeAncestor(state.layer.present, layer.id);
      if (nearestScopeAncestor.id === this.data.id) {
        store.dispatch(setTextSettings({
          fillColor: (nearestScopeAncestor as em.Text).style.fill.color,
          ...(nearestScopeAncestor as em.Text).textStyle
        }));
      }
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