import { importPaperProject } from '../store/selectors/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { openFillColorEditor, closeFillColorEditor } from '../store/actions/fillColorEditor';
import { openFillGradientEditor, closeFillGradientEditor } from '../store/actions/fillGradientEditor';
import { openStrokeColorEditor, closeStrokeColorEditor } from '../store/actions/strokeColorEditor';
import { openStrokeGradientEditor, closeStrokeGradientEditor } from '../store/actions/strokeGradientEditor';
import { RootState } from '../store/reducers';

class UndoRedoTool {
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
  }
  updateEditors(state: RootState) {
    if (state.fillColorEditor.isOpen) {
      const fillColorEditor = state.fillColorEditor;
      const layerItem = state.layer.present.byId[state.fillColorEditor.layer];
      if (layerItem) {
        const fill = layerItem.style.fill;
        const gradient = fill.gradient;
        if (fill.fillType === 'gradient') {
          store.dispatch(closeFillColorEditor());
          store.dispatch(openFillGradientEditor({layer: fillColorEditor.layer, x: fillColorEditor.x, y: fillColorEditor.y, gradient: gradient}));
        }
      } else {
        store.dispatch(closeFillColorEditor());
      }
    }
    if (state.fillGradientEditor.isOpen) {
      const fillGradientEditor = state.fillGradientEditor;
      const layerItem = state.layer.present.byId[state.fillGradientEditor.layer];
      if (layerItem) {
        const fill = layerItem.style.fill;
        if (fill.fillType === 'color') {
          store.dispatch(closeFillGradientEditor());
          store.dispatch(openFillColorEditor({layer: fillGradientEditor.layer, x: fillGradientEditor.x, y: fillGradientEditor.y, color: fill.color}));
        }
      } else {
        store.dispatch(closeFillGradientEditor());
      }
    }
    if (state.strokeColorEditor.isOpen) {
      const strokeColorEditor = state.strokeColorEditor;
      const layerItem = state.layer.present.byId[state.strokeColorEditor.layer];
      if (layerItem) {
        const stroke = layerItem.style.stroke;
        const gradient = stroke.gradient;
        if (stroke.fillType === 'gradient') {
          store.dispatch(closeStrokeColorEditor());
          store.dispatch(openStrokeGradientEditor({layer: strokeColorEditor.layer, x: strokeColorEditor.x, y: strokeColorEditor.y, gradient: gradient}));
        }
      } else {
        store.dispatch(closeStrokeColorEditor());
      }
    }
    if (state.strokeGradientEditor.isOpen) {
      const strokeGradientEditor = state.fillGradientEditor;
      const layerItem = state.layer.present.byId[state.strokeGradientEditor.layer];
      if (layerItem) {
        const stroke = layerItem.style.stroke;
        if (stroke.fillType === 'color') {
          store.dispatch(closeStrokeGradientEditor());
          store.dispatch(openStrokeColorEditor({layer: strokeGradientEditor.layer, x: strokeGradientEditor.x, y: strokeGradientEditor.y, color: stroke.color}));
        }
      } else {
        store.dispatch(closeStrokeGradientEditor());
      }
    }
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
            this.updateEditors(state);
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
            this.updateEditors(state);
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