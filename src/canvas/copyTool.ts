import { getPaperLayer, getLayerAndDescendants } from '../store/selectors/layer';
import { copyLayersToClipboard, pasteLayersFromClipboard } from '../store/actions/layer';
import store from '../store';
import { ActionCreators } from 'redux-undo';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';
import { applyShapeMethods } from './shapeUtils';
import { applyArtboardMethods } from './artboardUtils';
import { applyTextMethods } from './textUtils';
import { applyImageMethods } from './imageUtils';
import { paperMain } from './index';
import { bufferToBase64 } from '../utils';

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
            const paperProject = state.canvasSettings.allImageIds.reduce((result, current) => {
              const rasterBase64 = bufferToBase64(Buffer.from(state.canvasSettings.imageById[current].buffer));
              const base64 = `data:image/webp;base64,${rasterBase64}`;
              return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
            }, state.layer.present.paperProject);
            paperMain.project.importJSON(paperProject);
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
            state.layer.present.allImageIds.forEach((imageId) => {
              const raster = getPaperLayer(imageId).getItem({data: {id: 'Raster'}});
              applyImageMethods(raster);
            });
            updateHoverFrame(state.layer.present);
            updateSelectionFrame(state.layer.present);
          } else {
            // undo
            store.dispatch(ActionCreators.undo());
            paperMain.project.clear();
            const state = store.getState();
            const paperProject = state.canvasSettings.allImageIds.reduce((result, current) => {
              const rasterBase64 = bufferToBase64(Buffer.from(state.canvasSettings.imageById[current].buffer));
              const base64 = `data:image/webp;base64,${rasterBase64}`;
              return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
            }, state.layer.present.paperProject);
            paperMain.project.importJSON(paperProject);
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
            state.layer.present.allImageIds.forEach((imageId) => {
              const raster = getPaperLayer(imageId).getItem({data: {id: 'Raster'}});
              applyImageMethods(raster);
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
          const canvasImages = state.layer.present.clipboard.allIds.reduce((result, current) => {
            const layerAndDescendants = getLayerAndDescendants(state.layer.present, current, true);
            layerAndDescendants.forEach((id) => {
              if (state.layer.present.clipboard.byId[id].type === 'Image') {
                const imageId = (state.layer.present.clipboard.byId[id] as em.Image).imageId;
                result[imageId] = state.canvasSettings.imageById[imageId];
              }
            });
            return result;
          }, {});
          store.dispatch(pasteLayersFromClipboard({
            overSelection: event.modifiers.shift && state.layer.present.selected.length > 0,
            canvasImageById: canvasImages
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