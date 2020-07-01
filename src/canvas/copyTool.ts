import { getPaperLayer } from '../store/selectors/layer';
import { copyLayersToClipboard, pasteLayersFromClipboard } from '../store/actions/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { applyShapeMethods } from './shapeUtils';
import { applyArtboardMethods } from './artboardUtils';
import { applyTextMethods } from './textUtils';
import { paperMain } from './index';

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
      case 'z': {
        if (event.modifiers.meta) {
          if (event.modifiers.shift) {
            // redo
            store.dispatch(ActionCreators.redo());
            paperMain.project.clear();
            const state = store.getState();
            paperMain.project.importJSON(state.layer.present.paperProject);
            state.layer.present.allShapeIds.forEach((shapeId) => {
              applyShapeMethods(getPaperLayer(shapeId));
            });
            state.layer.present.allArtboardIds.forEach((artboardId) => {
              const artboardBackground = getPaperLayer(artboardId).getItem({data: {id: 'ArtboardBackground'}});
              applyArtboardMethods(artboardBackground);
            });
            state.layer.present.allTextIds.forEach((textId) => {
              applyTextMethods(getPaperLayer(textId));
            });
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
          } else {
            // undo
            store.dispatch(ActionCreators.undo());
            paperMain.project.clear();
            const state = store.getState();
            paperMain.project.importJSON(state.layer.present.paperProject);
            state.layer.present.allShapeIds.forEach((shapeId) => {
              applyShapeMethods(getPaperLayer(shapeId));
            });
            state.layer.present.allArtboardIds.forEach((artboardId) => {
              const artboardBackground = getPaperLayer(artboardId).getItem({data: {id: 'ArtboardBackground'}});
              applyArtboardMethods(artboardBackground);
            });
            state.layer.present.allTextIds.forEach((textId) => {
              applyTextMethods(getPaperLayer(textId));
            });
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
          }
        }
        break;
      }
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
          if (event.modifiers.shift) {
            store.dispatch(pasteLayersFromClipboard({overSelection: true}));
          } else {
            store.dispatch(pasteLayersFromClipboard({overSelection: false}));
          }
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