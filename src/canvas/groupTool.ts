import { ungroupLayers, groupLayers } from '../store/actions/layer';
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