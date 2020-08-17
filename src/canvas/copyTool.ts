import { getLayerAndDescendants } from '../store/selectors/layer';
import { copyLayersToClipboard, pasteLayersFromClipboard } from '../store/actions/layer';
import store from '../store';

class CopyTool {
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'c': {
        if (event.modifiers.meta) {
          const state = store.getState();
          store.dispatch(copyLayersToClipboard({layers: state.layer.present.selected}));
        }
        break;
      }
      case 'v': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.clipboard.allIds.length > 0) {
          const documentImages = state.layer.present.clipboard.allIds.reduce((result: { [id: string]: em.DocumentImage }, current) => {
            const layerAndDescendants = getLayerAndDescendants(state.layer.present, current, true);
            layerAndDescendants.forEach((id) => {
              if (state.layer.present.clipboard.byId[id].type === 'Image') {
                const imageId = state.layer.present.clipboard.byId[id].imageId;
                result[imageId] = state.documentSettings.images.byId[imageId];
              }
            });
            return result;
          }, {});
          store.dispatch(pasteLayersFromClipboard({
            overSelection: event.modifiers.shift && state.layer.present.selected.length > 0,
            documentImageById: documentImages
          }));
        }
        break;
      }
      case 'alt': {
        this.altModifier = true;
        break;
      }
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
    }
  }
}

export default CopyTool;