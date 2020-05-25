import store from '../store';
import { resizeLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getSelectionBottomRight } from '../store/selectors/layer';
import { updateSelectionFrame } from '../store/utils/layer';
import { paperMain } from './index';
import Tooltip from './tooltip';

class ResizeTool {
  ref: paper.Path;
  from: paper.Point;
  to: paper.Point;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  enabled: boolean;
  tooltip: Tooltip;
  scaleXDiff: number;
  scaleYDiff: number;
  verticalFlip: boolean;
  horizontalFlip: boolean;
  handle: string;
  shiftModifier: boolean;
  metaModifier: boolean;
  pivot: paper.Point;
  constructor() {
    this.ref = null;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.pivot = null;
  }
  enable(handle: string) {
    const state = store.getState();
    this.enabled = true;
    this.handle = handle;
    updateSelectionFrame(state.layer.present, this.handle);
  }
  disable() {
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.ref = null;
    this.from = null;
    this.to = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.enabled = false;
    this.tooltip = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.shiftModifier = false;
    this.metaModifier = false;
  }
  updateRef() {
    return new paperMain.Path.Rectangle({
      from: this.from,
      to: this.to,
      strokeWidth: 1,
      strokeColor: 'red'
    });
  }
  flipLayers(hor = 1, ver = 1) {
    const state = store.getState();
    state.layer.present.selected.forEach((layer) => {
      const paperLayer = getPaperLayer(layer);
      // switch(this.handle) {
      //   case 'topLeft': {
      //     //this.pivot = this.selectionBounds.bottomRight;
      //     paperLayer.pivot = this.selectionBounds.bottomRight;
      //     break;
      //   }
      //   case 'topCenter': {
      //     //this.pivot = this.selectionBounds.bottomCenter;
      //     paperLayer.pivot = this.selectionBounds.bottomCenter;
      //     break;
      //   }
      //   case 'topRight': {
      //     //this.pivot = this.selectionBounds.bottomLeft;
      //     paperLayer.pivot = this.selectionBounds.bottomLeft;
      //     break;
      //   }
      //   case 'bottomLeft': {
      //     //this.pivot = this.selectionBounds.topRight;
      //     paperLayer.pivot = this.selectionBounds.topRight;
      //     break;
      //   }
      //   case 'bottomCenter': {
      //     //this.pivot = this.selectionBounds.topCenter;
      //     paperLayer.pivot = this.selectionBounds.topCenter;
      //     break;
      //   }
      //   case 'bottomRight': {
      //     //this.pivot = this.selectionBounds.topLeft;
      //     paperLayer.pivot = this.selectionBounds.topLeft;
      //     break;
      //   }
      //   case 'leftCenter': {
      //     //this.pivot = this.selectionBounds.rightCenter;
      //     paperLayer.pivot = this.selectionBounds.rightCenter;
      //     break;
      //   }
      //   case 'rightCenter': {
      //     //this.pivot = this.selectionBounds.leftCenter;
      //     paperLayer.pivot = this.selectionBounds.leftCenter;
      //     break;
      //   }
      // }
      paperLayer.scale(hor, ver);
    });
  }
  onEscape() {
    if (this.enabled) {
      if (this.scaleXDiff || this.scaleYDiff) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          state.layer.present.selected.forEach((layer) => {
            const paperLayer = getPaperLayer(layer);
            const layerItem = state.layer.present.byId[layer];
            paperLayer.bounds.width = layerItem.frame.width;
            paperLayer.bounds.height = layerItem.frame.height;
            paperLayer.position.x = layerItem.frame.x;
            paperLayer.position.y = layerItem.frame.y;
          });
        }
      }
    }
    this.disable();
  }
  onMouseDown(event: paper.ToolEvent): void {
    const state = store.getState();
    const selectionBounds = getSelectionBounds(state.layer.present);
    switch(this.handle) {
      case 'topLeft': {
        //this.pivot = selectionBounds.bottomRight;
        this.from = selectionBounds.bottomRight;
        break;
      }
      case 'topCenter': {
        //this.pivot = selectionBounds.bottomCenter;
        this.from = selectionBounds.bottomCenter;
        break;
      }
      case 'topRight': {
        //this.pivot = selectionBounds.bottomLeft;
        this.from = selectionBounds.bottomLeft;
        break;
      }
      case 'bottomLeft': {
        //this.pivot = selectionBounds.topRight;
        this.from = selectionBounds.topRight;
        break;
      }
      case 'bottomCenter': {
        //this.pivot = selectionBounds.topCenter;
        this.from = selectionBounds.topCenter;
        break;
      }
      case 'bottomRight': {
        //this.pivot = selectionBounds.topLeft;
        this.from = selectionBounds.topLeft;
        break;
      }
      case 'leftCenter': {
        //this.pivot = selectionBounds.rightCenter;
        this.from = selectionBounds.rightCenter;
        break;
      }
      case 'rightCenter': {
        //this.pivot = selectionBounds.leftCenter;
        this.from = selectionBounds.leftCenter;
        break;
      }
    }
    state.layer.present.selected.forEach((layer) => {
      const paperLayer = getPaperLayer(layer);
      paperLayer.pivot = this.from;
    });
    this.fromBounds = selectionBounds;
    this.to = event.point;
    this.toBounds = new paperMain.Rectangle({
      from: this.from,
      to: this.to
    });
  }
  onMouseDrag(event: paper.ToolEvent): void {
    const state = store.getState();
    if (this.ref) {
      this.ref.remove();
    }
    const prevToBounds = this.toBounds;
    this.to = event.point;
    this.toBounds = new paperMain.Rectangle({
      from: this.from,
      to: this.to
    });
    this.scaleXDiff = this.toBounds.width / prevToBounds.width;
    this.scaleYDiff = this.toBounds.height / prevToBounds.height;
    this.ref = this.updateRef();
    switch(this.handle) {
      case 'topLeft': {
        if (this.to.x > this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'topRight';
        }
        if (this.to.y > this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'bottomLeft';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
        });
        break;
      }
      case 'topCenter': {
        if (this.to.y > this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'bottomCenter';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(1, this.scaleYDiff);
        });
        break;
      }
      case 'topRight': {
        if (this.to.x < this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'topLeft';
        }
        if (this.to.y > this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'bottomRight';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
        });
        break;
      }
      case 'bottomLeft': {
        if (this.to.x > this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'bottomRight';
        }
        if (this.to.y < this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'topLeft';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
        });
        break;
      }
      case 'bottomCenter': {
        if (this.to.y < this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'topCenter';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(1, this.scaleYDiff);
        });
        break;
      }
      case 'bottomRight': {
        if (this.to.x < this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'bottomLeft';
        }
        if (this.to.y < this.from.y) {
          this.horizontalFlip = true;
          this.flipLayers(1, -1);
          this.handle = 'topRight';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
        });
        break;
      }
      case 'leftCenter': {
        if (this.to.x > this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'rightCenter';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, 1);
        });
        break;
      }
      case 'rightCenter': {
        if (this.to.x < this.from.x) {
          this.verticalFlip = true;
          this.flipLayers(-1, 1);
          this.handle = 'leftCenter';
        }
        state.layer.present.selected.forEach((layer) => {
          const paperLayer = getPaperLayer(layer);
          paperLayer.scale(this.scaleXDiff, 1);
        });
        break;
      }
    }
    updateSelectionFrame(state.layer.present, this.handle);
    if (this.tooltip) {
      this.tooltip.paperLayer.remove();
    }
    this.tooltip = new Tooltip(`${Math.round(this.toBounds.width)} x ${Math.round(this.toBounds.height)}`, event.point, {drag: true, up: true});
    // if (this.enabled) {
    //   const state = store.getState();
    //   if (this.scaleXDiff || this.scaleYDiff) {
    //     if (paperMain.project.getItem({ data: { id: 'hoverFrame' } })) {
    //       paperMain.project.getItem({ data: { id: 'hoverFrame' } }).remove();
    //     }
    //     if (paperMain.project.getItem({ data: { id: 'selectionFrame' } })) {
    //       paperMain.project.getItem({ data: { id: 'selectionFrame' } }).remove();
    //     }
    //   }
    //   const selectionBounds = getSelectionBounds(state.layer.present);
    //   const newSelectionBounds = selectionBounds.clone();
    //   if (state.layer.present.selected.length > 0) {
    //     switch(this.handle) {
    //       case 'topLeft': {
    //         if (newSelectionBounds.width - event.delta.x <= 0) {
    //           this.handle = 'topRight';
    //           newSelectionBounds.width += event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width -= event.delta.x;
    //         }
    //         if (newSelectionBounds.height - event.delta.y <= 0) {
    //           this.handle = 'bottomLeft';
    //           newSelectionBounds.height += event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height -= event.delta.y;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         break;
    //       }
    //       case 'topCenter': {
    //         if (newSelectionBounds.height - event.delta.y <= 0) {
    //           this.handle = 'bottomCenter';
    //           newSelectionBounds.height += event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height -= event.delta.y;
    //         }
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         this.scaleXDiff = 0;
    //         break;
    //       }
    //       case 'topRight': {
    //         if (newSelectionBounds.width + event.delta.x <= 0) {
    //           this.handle = 'topLeft';
    //           newSelectionBounds.width -= event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width += event.delta.x;
    //         }
    //         if (newSelectionBounds.height - event.delta.y <= 0) {
    //           this.handle = 'bottomRight';
    //           newSelectionBounds.height += event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height -= event.delta.y;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         break;
    //       }
    //       case 'bottomLeft': {
    //         if (newSelectionBounds.width - event.delta.x <= 0) {
    //           this.handle = 'bottomRight';
    //           newSelectionBounds.width += event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width -= event.delta.x;
    //         }
    //         if (newSelectionBounds.height + event.delta.y <= 0) {
    //           this.handle = 'topLeft';
    //           newSelectionBounds.height -= event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height += event.delta.y;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         break;
    //       }
    //       case 'bottomCenter': {
    //         if (newSelectionBounds.height + event.delta.y <= 0) {
    //           this.handle = 'topCenter';
    //           newSelectionBounds.height -= event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height += event.delta.y;
    //         }
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         this.scaleXDiff = 0;
    //         break;
    //       }
    //       case 'bottomRight': {
    //         if (newSelectionBounds.width + event.delta.x <= 0) {
    //           this.handle = 'bottomLeft';
    //           newSelectionBounds.width -= event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width += event.delta.x;
    //         }
    //         if (newSelectionBounds.height + event.delta.y <= 0) {
    //           this.handle = 'topRight';
    //           newSelectionBounds.height -= event.delta.y;
    //           this.verticalFlip = !this.verticalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(1, -1);
    //           });
    //         } else {
    //           newSelectionBounds.height += event.delta.y;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = newSelectionBounds.height / selectionBounds.height;
    //         break;
    //       }
    //       case 'leftCenter': {
    //         if (newSelectionBounds.width - event.delta.x <= 0) {
    //           this.handle = 'rightCenter';
    //           newSelectionBounds.width += event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width -= event.delta.x;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = 0;
    //         break;
    //       }
    //       case 'rightCenter': {
    //         if (newSelectionBounds.width + event.delta.x <= 0) {
    //           this.handle = 'leftCenter';
    //           newSelectionBounds.width -= event.delta.x;
    //           this.horizontalFlip = !this.horizontalFlip;
    //           state.layer.present.selected.forEach((layer) => {
    //             const paperLayer = getPaperLayer(layer);
    //             paperLayer.scale(-1, 1);
    //           });
    //         } else {
    //           newSelectionBounds.width += event.delta.x;
    //         }
    //         this.scaleXDiff = newSelectionBounds.width / selectionBounds.width;
    //         this.scaleYDiff = 0;
    //         break;
    //       }
    //     }
    //     state.layer.present.selected.forEach((layer) => {
    //       const paperLayer = getPaperLayer(layer);
    //       switch(this.handle) {
    //         case 'topLeft': {
    //           paperLayer.pivot = selectionBounds.bottomRight;
    //           break;
    //         }
    //         case 'topCenter': {
    //           paperLayer.pivot = selectionBounds.bottomCenter;
    //           break;
    //         }
    //         case 'topRight': {
    //           paperLayer.pivot = selectionBounds.bottomLeft;
    //           break;
    //         }
    //         case 'bottomLeft': {
    //           paperLayer.pivot = selectionBounds.topRight;
    //           break;
    //         }
    //         case 'bottomCenter': {
    //           paperLayer.pivot = selectionBounds.topCenter;
    //           break;
    //         }
    //         case 'bottomRight': {
    //           paperLayer.pivot = selectionBounds.topLeft;
    //           break;
    //         }
    //         case 'leftCenter': {
    //           paperLayer.pivot = selectionBounds.rightCenter;
    //           break;
    //         }
    //         case 'rightCenter': {
    //           paperLayer.pivot = selectionBounds.leftCenter;
    //           break;
    //         }
    //       }
    //       if (this.shiftModifier) {
    //         paperLayer.scale(this.scaleXDiff);
    //       } else {
    //         switch(this.handle) {
    //           case 'topLeft':
    //           case 'topRight':
    //           case 'bottomLeft':
    //           case 'bottomRight': {
    //             paperLayer.scale(this.scaleXDiff, this.scaleYDiff);
    //             break;
    //           }
    //           case 'topCenter':
    //           case 'bottomCenter': {
    //             paperLayer.scale(1, this.scaleYDiff);
    //             break;
    //           }
    //           case 'leftCenter':
    //           case 'rightCenter': {
    //             paperLayer.scale(this.scaleXDiff, 1);
    //             break;
    //           }
    //         }
    //       }
    //       paperLayer.pivot = paperLayer.bounds.center;
    //     });
    //     updateSelectionFrame(state.layer.present, this.handle);
    //     if (this.tooltip) {
    //       this.tooltip.paperLayer.remove();
    //     }
    //     this.tooltip = new Tooltip(`${Math.round(selectionBounds.width)} x ${Math.round(selectionBounds.height)}`, event.point, {drag: true, up: true});
    //   }
    // }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.ref) {
      this.ref.remove();
    }
    if (this.enabled) {
      if (this.scaleXDiff || this.scaleYDiff) {
        const state = store.getState();
        if (state.layer.present.selected.length > 0) {
          store.dispatch(resizeLayers({layers: state.layer.present.selected, verticalFlip: this.verticalFlip, horizontalFlip: this.horizontalFlip}));
        }
        updateSelectionFrame(state.layer.present);
      }
    }
    this.disable();
  }
}

export default ResizeTool;