import store from '../store';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants, getInViewSnapPoints } from '../store/selectors/layer';
import { updateSelectionFrame, updateActiveArtboardFrame } from '../store/utils/layer';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR, THEME_GUIDE_COLOR } from '../constants';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class DragTool {
  state: RootState;
  originalSelection: string[];
  duplicateSelection: string[];
  enabled: boolean;
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  snapTool: SnapTool;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  ref: paper.Path.Rectangle;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  centerOffset: paper.Point;
  moveHandle: boolean;
  constructor() {
    this.state = null;
    this.moveHandle = false;
    this.originalSelection = null;
    this.duplicateSelection = null;
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
    this.ref = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.snapTool = null;
  }
  enable(moveHandle = false) {
    this.state = store.getState();
    store.dispatch(setCanvasDragging({dragging: true}));
    this.enabled = true;
    this.snapTool = new SnapTool();
    this.moveHandle = moveHandle;
  }
  disable() {
    store.dispatch(setCanvasDragging({dragging: false}));
    this.state = null;
    this.moveHandle = false;
    this.originalSelection = null;
    this.duplicateSelection = null;
    this.enabled = false;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.ref = null;
    this.fromBounds = null;
    this.toBounds = null;
    this.snapTool = null;
  }
  updateRef() {
    if (this.ref) {
      this.ref.remove();
    }
    this.ref = new paperMain.Path.Rectangle({
      rectangle: this.toBounds,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom
    });
    this.ref.removeOn({
      drag: true,
      up: true
    });
  }
  updateSnapPoints() {
    let allSelectedLayers: string[] = [];
    this.state.layer.present.selected.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(this.state.layer.present, id);
      allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
    });
    this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
  }
  duplicate() {
    store.dispatch(duplicateLayers({layers: this.originalSelection}));
    this.state = store.getState();
    this.duplicateSelection = this.state.layer.present.selected;
    this.updateSnapPoints();
    this.originalSelection.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const layerItem = this.state.layer.present.byId[id];
      paperLayer.position.x = layerItem.frame.x;
      paperLayer.position.y = layerItem.frame.y;
    });
  }
  clearDuplicate() {
    store.dispatch(removeDuplicatedLayers({layers: this.duplicateSelection, newSelection: this.originalSelection}));
    this.state = store.getState();
    this.duplicateSelection = null;
    this.updateSnapPoints();
  }
  translateLayers() {
    if (this.altModifier && !this.duplicateSelection) {
      this.duplicate();
    }
    const translate = {
      x: this.toBounds.center.x - this.fromBounds.center.x,
      y: this.toBounds.center.y - this.fromBounds.center.y
    };
    const selection = this.altModifier ? this.duplicateSelection : this.originalSelection;
    selection.forEach((id) => {
      const paperLayer = getPaperLayer(id);
      const layerItem = this.state.layer.present.byId[id];
      paperLayer.position.x = layerItem.frame.x + translate.x;
      paperLayer.position.y = layerItem.frame.y + translate.y;
    });
    updateSelectionFrame(this.state.layer.present, this.moveHandle ? 'move' : 'none');
    updateActiveArtboardFrame(this.state.layer.present);
    this.snapTool.updateGuides();
  }
  onKeyDown(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = true;
        break;
      }
      case 'meta': {
        this.metaModifier = true;
        break;
      }
      case 'alt': {
        this.altModifier = true;
        if ((this.x || this.y) && !this.duplicateSelection) {
          this.duplicate();
          this.translateLayers();
        }
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent) {
    switch(event.key) {
      case 'shift': {
        this.shiftModifier = false;
        break;
      }
      case 'meta': {
        this.metaModifier = false;
        break;
      }
      case 'alt': {
        this.altModifier = false;
        if ((this.x || this.y) && this.duplicateSelection) {
          this.clearDuplicate();
          this.translateLayers();
        }
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    if (this.enabled) {
      // get selection bounds
      const selectionBounds = getSelectionBounds(this.state.layer.present);
      this.originalSelection = this.state.layer.present.selected;
      this.fromBounds = selectionBounds;
      this.from = event.point;
      this.to = event.point;
      this.toBounds = new paperMain.Rectangle(this.fromBounds);
      this.snapTool.snapBounds = this.toBounds.clone();
      this.updateSnapPoints();
      updateSelectionFrame(this.state.layer.present, this.moveHandle ? 'move' : 'none');
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    if (this.enabled) {
      this.x += event.delta.x;
      this.y += event.delta.y;
      this.to = event.point;
      this.toBounds.center.x = this.fromBounds.center.x + this.x;
      this.toBounds.center.y = this.fromBounds.center.y + this.y;
      this.snapTool.snapBounds = this.toBounds.clone();
      this.snapTool.updateXSnap({
        event: event,
        snapTo: {
          left: true,
          right: true,
          center: true
        },
        handleSnapped: (snapPoint: em.SnapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'left':
              this.snapTool.snapBounds.center.x = snapPoint.point + (this.fromBounds.width / 2);
              break;
            case 'center':
              this.snapTool.snapBounds.center.x = snapPoint.point;
              break;
            case 'right':
              this.snapTool.snapBounds.center.x = snapPoint.point - (this.fromBounds.width / 2);
              break;
          }
        },
        handleSnap: (closestXSnap: { bounds: em.SnapBound; snapPoint: em.SnapPoint; distance: number }) => {
          switch(closestXSnap.bounds.side) {
            case 'left':
              this.snapTool.snapBounds.center.x = closestXSnap.snapPoint.point + (this.fromBounds.width / 2);
              break;
            case 'center':
              this.snapTool.snapBounds.center.x = closestXSnap.snapPoint.point;
              break;
            case 'right':
              this.snapTool.snapBounds.center.x = closestXSnap.snapPoint.point - (this.fromBounds.width / 2);
              break;
          }
        }
      });
      this.snapTool.updateYSnap({
        event: event,
        snapTo: {
          top: true,
          bottom: true,
          center: true
        },
        handleSnapped: (snapPoint: em.SnapPoint) => {
          switch(snapPoint.boundsSide) {
            case 'top':
              this.snapTool.snapBounds.center.y = snapPoint.point + (this.fromBounds.height / 2);
              break;
            case 'center':
              this.snapTool.snapBounds.center.y = snapPoint.point;
              break;
            case 'bottom':
              this.snapTool.snapBounds.center.y = snapPoint.point - (this.fromBounds.height / 2);
              break;
          }
        },
        handleSnap: (closestYSnap: { bounds: em.SnapBound; snapPoint: em.SnapPoint; distance: number }) => {
          switch(closestYSnap.bounds.side) {
            case 'top':
              this.snapTool.snapBounds.center.y = closestYSnap.snapPoint.point + (this.fromBounds.height / 2);
              break;
            case 'center':
              this.snapTool.snapBounds.center.y = closestYSnap.snapPoint.point;
              break;
            case 'bottom':
              this.snapTool.snapBounds.center.y = closestYSnap.snapPoint.point - (this.fromBounds.height / 2);
              break;
          }
        }
      });
      this.toBounds = this.snapTool.snapBounds;
      this.translateLayers();
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    if (this.enabled) {
      if (this.x || this.y) {
        if (this.state.layer.present.selected.length > 0) {
          store.dispatch(moveLayersBy({layers: this.state.layer.present.selected, x: this.x, y: this.y}));
        }
        if (this.ref) {
          this.ref.remove();
        }
      } else {
        updateSelectionFrame(this.state.layer.present);
      }
      this.disable();
    }
  }
}

export default DragTool;