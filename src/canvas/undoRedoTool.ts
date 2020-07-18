import { importPaperProject, colorsMatch, gradientsMatch } from '../store/selectors/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame, updateActiveArtboardFrame } from '../store/utils/layer';
import { openColorEditor, closeColorEditor } from '../store/actions/colorEditor';
import { openGradientEditor, closeGradientEditor } from '../store/actions/gradientEditor';
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
  updateEditors(state: RootState, type: 'redo' | 'undo') {
    if (state.colorEditor.isOpen) {
      const layerItem = state.layer.present.byId[state.colorEditor.layer];
      const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.colorEditor.layer] : state.layer.future[0].byId[state.colorEditor.layer];
      // check if items exist and matches selection
      if (layerItem && prevLayerItem && state.layer.present.selected[0] === state.colorEditor.layer) {
        const style = layerItem.style[state.colorEditor.prop];
        const prevStyle = prevLayerItem.style[state.colorEditor.prop];
        // check if fill types match
        if (style.fillType === prevStyle.fillType) {
          // check if prev action creator was for color
          if (colorsMatch(style.color, prevStyle.color)) {
            store.dispatch(closeColorEditor());
          }
        } else {
          // if fill types dont match, open relevant editor
          switch(style.fillType) {
            case 'gradient': {
              const gradient = (style as em.Fill | em.Stroke).gradient;
              store.dispatch(closeColorEditor());
              store.dispatch(openGradientEditor({layer: state.colorEditor.layer, x: state.colorEditor.x, y: state.colorEditor.y, gradient: gradient, prop: state.colorEditor.prop}));
            }
          }
        }
      } else {
        store.dispatch(closeColorEditor());
      }
    }
    if (state.gradientEditor.isOpen) {
      const layerItem = state.layer.present.byId[state.gradientEditor.layer];
      const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.gradientEditor.layer] : state.layer.future[0].byId[state.gradientEditor.layer];
      // check if items exist and matches selection
      if (layerItem && prevLayerItem && state.layer.present.selected[0] === state.gradientEditor.layer) {
        const style = layerItem.style[state.gradientEditor.prop];
        const prevStyle = prevLayerItem.style[state.gradientEditor.prop];
        // check if fill types match
        if (style.fillType === prevStyle.fillType) {
          // check if prev action creator was for gradient
          if (gradientsMatch((style as em.Fill | em.Stroke).gradient, (prevStyle as em.Fill | em.Stroke).gradient)) {
            store.dispatch(closeGradientEditor());
          }
        } else {
          // if fill types dont match, open relevant editor
          switch(style.fillType) {
            case 'color': {
              const color = (style as em.Fill | em.Stroke).color;
              store.dispatch(closeGradientEditor());
              store.dispatch(openColorEditor({layer: state.gradientEditor.layer, x: state.gradientEditor.x, y: state.gradientEditor.y, color: color, prop: state.gradientEditor.prop}));
              break;
            }
          }
        }
      } else {
        store.dispatch(closeGradientEditor());
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
            // update editors
            this.updateEditors(state, 'redo');
            // update frames
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
            updateActiveArtboardFrame(state.layer.present);
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
            // update editors
            this.updateEditors(state, 'undo');
            // update frames
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
            updateActiveArtboardFrame(state.layer.present);
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