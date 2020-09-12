import { clipboard } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { getLayerAndDescendants, getPaperLayer } from '../store/selectors/layer';
import { pasteLayersThunk, copyLayersThunk } from '../store/actions/layer';
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
          store.dispatch(copyLayersThunk() as any);
        }
        break;
      }
      case 'v': {
        if (event.modifiers.meta) {
          store.dispatch(pasteLayersThunk({overSelection: event.modifiers.shift}) as any);
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