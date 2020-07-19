import { ungroupLayers, groupLayers, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack } from '../store/actions/layer';
import store from '../store';
import { RootState } from '../store/reducers';

class GroupTool {
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
  }
  canMoveBackward(state: RootState): boolean {
    return !state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      const parent = state.layer.present.byId[layer.parent];
      return parent.children[0] === id;
    });
  }
  canMoveForward(state: RootState): boolean {
    return !state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      const parent = state.layer.present.byId[layer.parent];
      return parent.children[parent.children.length - 1] === id;
    });
  }
  canGroup(state: RootState): boolean {
    return !state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      return layer.type === 'Artboard';
    });
  }
  canUngroup(state: RootState): boolean {
    return state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      return layer.type === 'Group';
    });
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'g': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.selected.length > 0) {
          if (event.modifiers.shift) {
            if (this.canUngroup(state)) {
              store.dispatch(ungroupLayers({layers: state.layer.present.selected}));
            }
          } else {
            if (this.canGroup(state)) {
              store.dispatch(groupLayers({layers: state.layer.present.selected}));
            }
          }
        }
        break;
      }
      case '[': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.selected.length > 0 && this.canMoveBackward(state)) {
          if (event.modifiers.shift) {
            // send to back
            store.dispatch(sendLayersToBack({layers: state.layer.present.selected}));
          } else {
            // send backward
            store.dispatch(sendLayersBackward({layers: state.layer.present.selected}));
          }
        }
        break;
      }
      case ']': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.selected.length > 0 && this.canMoveForward(state)) {
          if (event.modifiers.shift) {
            // send to back
            store.dispatch(sendLayersToFront({layers: state.layer.present.selected}));
          } else {
            // send backward
            store.dispatch(sendLayersForward({layers: state.layer.present.selected}));
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

export default GroupTool;