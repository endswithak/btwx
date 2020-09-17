import { importPaperProject, colorsMatch, gradientsMatch } from '../store/selectors/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame, updateActiveArtboardFrame, updateTweenEventsFrame } from '../store/utils/layer';
import { openColorEditor, closeColorEditor } from '../store/actions/colorEditor';
import { openGradientEditor, closeGradientEditor } from '../store/actions/gradientEditor';
import { setLayerHover } from '../store/actions/layer';
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
      // const layerItem = state.layer.present.byId[state.colorEditor.layer];
      const layerItems = state.colorEditor.layers.reduce((result, current) => {
        return [...result, state.layer.present.byId[current]];
      }, []);
      // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.colorEditor.layer] : state.layer.future[0].byId[state.colorEditor.layer];
      const prevLayerItems = type === 'redo' ? state.colorEditor.layers.reduce((result, current) => {
        return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
      }, []) : state.colorEditor.layers.reduce((result, current) => {
        return [...result, state.layer.future[0].byId[current]];
      }, []);
      // check if items exist and matches selection
      if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.colorEditor.layers[index])) {
        const style = layerItems[0].style[state.colorEditor.prop];
        const prevStyle = prevLayerItems[0].style[state.colorEditor.prop];
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
              store.dispatch(closeColorEditor());
              store.dispatch(openGradientEditor({layers: state.colorEditor.layers, x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
            }
          }
        }
      } else {
        store.dispatch(closeColorEditor());
      }
    }
    if (state.gradientEditor.isOpen) {
      // const layerItem = state.layer.present.byId[state.gradientEditor.layer];
      const layerItems = state.gradientEditor.layers.reduce((result, current) => {
        return [...result, state.layer.present.byId[current]];
      }, []);
      // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.gradientEditor.layer] : state.layer.future[0].byId[state.gradientEditor.layer];
      const prevLayerItems = type === 'redo' ? state.gradientEditor.layers.reduce((result, current) => {
        return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
      }, []) : state.gradientEditor.layers.reduce((result, current) => {
        return [...result, state.layer.future[0].byId[current]];
      }, []);
      // check if items exist and matches selection
      if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.gradientEditor.layers[index])) {
        const style = layerItems[0].style[state.gradientEditor.prop];
        const prevStyle = prevLayerItems[0].style[state.gradientEditor.prop];
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
              store.dispatch(closeGradientEditor());
              store.dispatch(openColorEditor({layers: state.gradientEditor.layers, x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
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
        const state = store.getState();
        if (event.modifiers.meta && !state.textEditor.isOpen) {
          if (event.modifiers.shift) {
            if (state.layer.future.length > 0) {
              // remove hover
              store.dispatch(setLayerHover({id: null}));
              // redo
              store.dispatch(ActionCreators.redo());
              // get state
              const state = store.getState();
              // import future paper project
              importPaperProject({
                paperProject: state.layer.present.paperProject,
                documentImages: state.documentSettings.images.byId,
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
              if (state.tweenDrawer.isOpen && state.layer.present.allTweenEventIds.length > 0) {
                updateTweenEventsFrame(state.layer.present, state.tweenDrawer.event === null ? state.layer.present.allTweenEventIds.reduce((result, current) => {
                  const tweenEvent = state.layer.present.tweenEventById[current];
                  if (tweenEvent.artboard === state.layer.present.activeArtboard || current === state.tweenDrawer.eventHover) {
                    result = [...result, tweenEvent];
                  }
                  return result;
                }, []) : [state.layer.present.tweenEventById[state.tweenDrawer.event]], state.tweenDrawer.eventHover, state.theme.theme);
              }
            }
          } else {
            if (state.layer.past.length > 0) {
              // remove hover
              store.dispatch(setLayerHover({id: null}));
              // undo
              store.dispatch(ActionCreators.undo());
              // get state
              const state = store.getState();
              // import past paper project
              importPaperProject({
                paperProject: state.layer.present.paperProject,
                documentImages: state.documentSettings.images.byId,
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
              if (state.tweenDrawer.isOpen && state.layer.present.allTweenEventIds.length > 0) {
                updateTweenEventsFrame(state.layer.present, state.tweenDrawer.event === null ? state.layer.present.allTweenEventIds.reduce((result, current) => {
                  const tweenEvent = state.layer.present.tweenEventById[current];
                  if (tweenEvent.artboard === state.layer.present.activeArtboard || current === state.tweenDrawer.eventHover) {
                    result = [...result, tweenEvent];
                  }
                  return result;
                }, []) : [state.layer.present.tweenEventById[state.tweenDrawer.event]], state.tweenDrawer.eventHover, state.theme.theme);
              }
            }
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