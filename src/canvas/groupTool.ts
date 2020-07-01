import { ungroupLayers, groupLayers, sendLayersForward, sendLayersToFront, sendLayersBackward, sendLayersToBack } from '../store/actions/layer';
import store from '../store';

class GroupTool {
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
  }
  canMoveBackward(): boolean {
    const state = store.getState();
    return !state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      const parent = state.layer.present.byId[layer.parent];
      return parent.children[0] === id;
    });
  }
  canMoveForward(): boolean {
    const state = store.getState();
    return !state.layer.present.selected.some((id: string) => {
      const layer = state.layer.present.byId[id];
      const parent = state.layer.present.byId[layer.parent];
      return parent.children[parent.children.length - 1] === id;
    });
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'g': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.selected.length > 0) {
          if (event.modifiers.shift) {
            store.dispatch(ungroupLayers({layers: state.layer.present.selected}));
          } else {
            store.dispatch(groupLayers({layers: state.layer.present.selected}));
          }
        }
        break;
      }
      case '[': {
        const state = store.getState();
        if (event.modifiers.meta && state.layer.present.selected.length > 0 && this.canMoveBackward()) {
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
        if (event.modifiers.meta && state.layer.present.selected.length > 0 && this.canMoveForward()) {
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