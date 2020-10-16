import store from '../store';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers, updateSelectionFrame, updateMeasureFrame } from '../store/actions/layer';
import { getPaperLayer, getSelectionBounds, getLayerAndDescendants } from '../store/selectors/layer';
import { paperMain } from './index';
import SnapTool from './snapTool';
import { RootState } from '../store/reducers';

class DragTool {
  state: RootState;
  originalSelection: string[];
  duplicateSelection: string[];
  x: number;
  y: number;
  from: paper.Point;
  to: paper.Point;
  snapTool: SnapTool;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  fromBounds: paper.Rectangle;
  toBounds: paper.Rectangle;
  handle: boolean;
  constructor(handle?: boolean) {
    this.handle = handle;
    this.originalSelection = null;
    this.duplicateSelection = null;
    this.x = null;
    this.y = null;
    this.from = null;
    this.to = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
    this.fromBounds = null;
    this.toBounds = null;
    this.snapTool = new SnapTool();
  }
  updateSnapPoints(): void {
    let allSelectedLayers: string[] = [];
    this.state.layer.present.selected.forEach((id) => {
      const layerAndDescendants = getLayerAndDescendants(this.state.layer.present, id);
      allSelectedLayers = [...allSelectedLayers, ...layerAndDescendants];
    });
    this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints.filter((snapPoint: em.SnapPoint) => !allSelectedLayers.includes(snapPoint.id));
  }
  duplicate(): void {
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
  getMeasureGuides(): { top?: string; bottom?: string; left?: string; right?: string; all?: string } {
    const measureGuides: { top?: string; bottom?: string; left?: string; right?: string; all?: string } = {};
    if (this.snapTool.snap.x) {
      if (!this.toBounds.intersects(getPaperLayer(this.snapTool.snap.x.id).bounds, 1)) {
        measureGuides['top'] = this.snapTool.snap.x.id;
        measureGuides['bottom'] = this.snapTool.snap.x.id;
      }
    }
    if (this.snapTool.snap.y) {
      if (!this.toBounds.intersects(getPaperLayer(this.snapTool.snap.y.id).bounds, 1)) {
        measureGuides['left'] = this.snapTool.snap.y.id;
        measureGuides['right'] = this.snapTool.snap.y.id;
      }
    }
    return measureGuides;
  }
  clearDuplicate(): void {
    store.dispatch(removeDuplicatedLayers({layers: this.duplicateSelection, newSelection: this.originalSelection}));
    this.state = store.getState();
    this.duplicateSelection = null;
    this.updateSnapPoints();
  }
  translateLayers(): void {
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
    this.snapTool.updateGuides();
    updateSelectionFrame(this.state, this.handle ? 'move' : 'none') as any
    updateMeasureFrame(this.state, this.getMeasureGuides()) as any
  }
  onKeyDown(event: paper.KeyEvent): void {
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
  onKeyUp(event: paper.KeyEvent): void {
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
          this.updateSnapPoints();
          this.translateLayers();
        }
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const selectionBounds = getSelectionBounds(this.state.layer.present);
    this.originalSelection = this.state.layer.present.selected;
    this.fromBounds = selectionBounds;
    this.from = event.point;
    this.to = event.point;
    this.toBounds = new paperMain.Rectangle(this.fromBounds);
    this.snapTool.snapBounds = this.toBounds.clone();
    this.updateSnapPoints();
    if (event.modifiers.alt) {
      this.altModifier = true;
      if ((this.x || this.y) && !this.duplicateSelection) {
        this.duplicate();
        this.translateLayers();
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
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
  onMouseUp(event: paper.ToolEvent): void {
    if (this.x || this.y) {
      if (this.state.layer.present.selected.length > 0) {
        store.dispatch(moveLayersBy({layers: this.state.layer.present.selected, x: this.x, y: this.y}));
      }
    }
  }
}

export default DragTool;