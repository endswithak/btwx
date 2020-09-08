import { clipboard } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { getLayerAndDescendants, getPaperLayer } from '../store/selectors/layer';
import { addLayersThunk, selectLayers } from '../store/actions/layer';
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
          if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
            const layers = state.layer.present.selected.reduce((result, current) => {
              const layerAndDescendants = getLayerAndDescendants(state.layer.present, current);
              const imageLayers = layerAndDescendants.filter(id => state.layer.present.byId[id].type === 'Image');
              const imageBuffers = imageLayers.reduce((bufferResult, bufferCurrent) => {
                const imageId = (state.layer.present.byId[bufferCurrent] as em.Image).imageId;
                if (!Object.keys(bufferResult).includes(imageId)) {
                  bufferResult[imageId] = state.documentSettings.images.byId[imageId];
                }
                return bufferResult;
              }, {} as { [id: string]: em.DocumentImage });
              result.images = { ...result.images, ...imageBuffers };
              result.main = [...result.main, current];
              result.allIds = [...result.allIds, ...layerAndDescendants];
              result.byId = layerAndDescendants.reduce((lr, cr) => {
                lr = {
                  ...lr,
                  [cr]: {
                    ...state.layer.present.byId[cr],
                    tweenEvents: [],
                    tweens: [],
                    children: ((): string[] => {
                      const layerItem = state.layer.present.byId[cr];
                      const hasChildren = layerItem.type === 'Artboard' || layerItem.type === 'Group';
                      return hasChildren ? [] : null;
                    })()
                  }
                }
                return lr;
              }, result.byId);
              return result;
            }, { type: 'layers', main: [], allIds: [], byId: {}, images: {} } as em.ClipboardLayers);
            clipboard.writeText(JSON.stringify(layers));
          }
        }
        break;
      }
      case 'v': {
        const state = store.getState();
        if (event.modifiers.meta && state.canvasSettings.focusing) {
          const text = clipboard.readText();
          const parsedText: em.ClipboardLayers = JSON.parse(text);
          if (parsedText.type && parsedText.type === 'layers') {
            const replaceAll = (str: string, find: string, replace: string) => {
              return str.replace(new RegExp(find, 'g'), replace);
            }
            const withNewIds: string = parsedText.allIds.reduce((result: string, current: string) => {
              const newId = uuidv4();
              result = replaceAll(result, current, newId);
              return result;
            }, text);
            const newParse: em.ClipboardLayers = JSON.parse(withNewIds);
            const newLayers = Object.keys(newParse.byId).reduce((result, current) => {
              result = [...result, newParse.byId[current]];
              return result;
            }, []);
            store.dispatch(addLayersThunk({layers: newLayers, buffers: newParse.images}) as any).then(() => {
              store.dispatch(selectLayers({layers: newParse.main, newSelection: true}));
            });
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