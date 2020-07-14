import { importPaperProject } from '../store/selectors/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';

class UndoRedoTool {
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
            // get state
            const state = store.getState();
            // import future paper project
            importPaperProject({
              paperProject: state.layer.present.paperProject,
              canvasImages: state.canvasSettings.imageById,
              layers: {
                shape: state.layer.present.allShapeIds,
                artboard: state.layer.present.allArtboardIds,
                text: state.layer.present.allTextIds,
                image: state.layer.present.allImageIds
              }
            });
            // update frames
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
          } else {
            // undo
            store.dispatch(ActionCreators.undo());
            // get state
            const state = store.getState();
            // import past paper project
            importPaperProject({
              paperProject: state.layer.present.paperProject,
              canvasImages: state.canvasSettings.imageById,
              layers: {
                shape: state.layer.present.allShapeIds,
                artboard: state.layer.present.allArtboardIds,
                text: state.layer.present.allTextIds,
                image: state.layer.present.allImageIds
              }
            });
            // update frames
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
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

export default UndoRedoTool;