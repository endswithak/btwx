import paper from 'paper';
import { getPagePaperLayer, getNearestScopeAncestor } from '../store/selectors/layer';
import { selectLayers } from '../store/actions/layer';
import store from '../store';
import { paperMain } from './index';
import { THEME_PRIMARY_COLOR } from '../constants';
import { RootState } from '../store/reducers';

class AreaSelectTool {
  state: RootState;
  from: paper.Point;
  to: paper.Point;
  overlapped: string[];
  shape: paper.Path;
  shiftModifier: boolean;
  metaModifier: boolean;
  altModifier: boolean;
  constructor() {
    // this.tool = new paperMain.Tool();
    // this.tool.activate();
    // this.tool.minDistance = 1;
    // this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    // this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    // this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    // this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    // this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.from = null;
    this.to = null;
    this.shape = null;
    this.shiftModifier = false;
    this.metaModifier = false;
    this.altModifier = false;
    this.overlapped = [];
    // if (nativeEvent) {
    //   const event = {
    //     ...nativeEvent,
    //     point: paperMain.view.getEventPoint(nativeEvent),
    //     modifiers: {
    //       shift: nativeEvent.shiftKey,
    //       alt: nativeEvent.altKey,
    //       meta: nativeEvent.metaKey,
    //       ctrl: nativeEvent.ctrlKey
    //     }
    //   };
    //   this.onMouseDown(event);
    // }
  }
  update(to: paper.Point) {
    this.to = to;
    this.shape = this.renderAreaSelectShape({});
  }
  renderAreaSelectShape(shapeOpts: any) {
    if (this.shape) {
      this.shape.remove();
    }
    const selectAreaShape = new paperMain.Path.Rectangle({
      from: this.from,
      to: this.to,
      fillColor: new paper.Color(THEME_PRIMARY_COLOR),
      opacity: 0.5,
      ...shapeOpts
    });
    selectAreaShape.removeOn({
      up: true
    });
    return selectAreaShape;
  }
  hitTestLayers() {
    const layers: string[] = [];
    // get overlapped page layers
    const overlappedLayers = getPagePaperLayer(this.state.layer.present).getItems({
      data: (data: any) => {
        if (data.type === 'Layer') {
          const topParent = getNearestScopeAncestor(this.state.layer.present, data.id);
          return topParent.id === data.id;
        }
      },
      overlapping: this.shape.bounds
    });
    // add fully overlapped artboards, overlapped children of
    // partially overlapped artboards, and overlapped page layers
    // to final layers array
    overlappedLayers.forEach((item: paper.Item) => {
      if (item.data.layerType === 'Artboard') {
        if (item.isInside(this.shape.bounds)) {
          layers.push(item.data.id);
        } else {
          item.getItems({
            data: (data: any) => {
              if (data.type === 'Layer') {
                if (this.state.layer.present.byId[item.data.id].children.includes(data.id)) {
                  layers.push(data.id);
                }
              }
            },
            overlapping: this.shape.bounds
          });
        }
      } else {
        layers.push(item.data.id);
      }
    });
    // return final layers array
    return layers;
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
        break;
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    this.state = store.getState();
    // set from point
    this.from = event.point;
    // deselect all if layers if no shift modifier
    // if (!event.modifiers.shift) {
    //   store.dispatch(deselectAllLayers());
    //   this.state = store.getState();
    // }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.update(event.point);
    // if (!this.to) {
    //   store.dispatch(setCanvasSelecting({selecting: true}));
    //   this.state = store.getState();
    // }
    // // update to point and area select shape
    // this.update(event.point);
    // if (this.to) {
    //   // get hit test layers
    //   const hitTestLayers = this.hitTestLayers();
    //   // loop through hit test layers
    //   hitTestLayers.forEach((id: string) => {
    //     // process layer if not included in overlapped
    //     if (!this.overlapped.includes(id)) {
    //       // if shift modifier, add or remove layer from selected
    //       if (this.shiftModifier) {
    //         if (this.state.layer.present.selected.includes(id)) {
    //           store.dispatch(deselectLayer({id}));
    //         } else {
    //           store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
    //         }
    //       }
    //       // else, add layer to selected
    //       else {
    //         store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
    //       }
    //       // push layer id to overlapped
    //       this.overlapped.push(id);
    //     }
    //   });
    //   // loop through overlapped
    //   this.overlapped.forEach((id: string) => {
    //     // process layer if not included in hitTestLayers
    //     if (!hitTestLayers.includes(id)) {
    //       // if shift modifier, add or remove layer from selected
    //       if (this.shiftModifier) {
    //         if (this.state.layer.present.selected.includes(id)) {
    //           store.dispatch(deselectLayer({id}));
    //         } else {
    //           store.dispatch(selectLayer({id, noActiveArtboardUpdate: true}));
    //         }
    //       }
    //       // else, remove layer from selected
    //       else {
    //         store.dispatch(deselectLayer({id}));
    //       }
    //       // remove layer from overlapped
    //       this.overlapped = this.overlapped.filter((layer) => layer !== id);
    //     }
    //   });
    // }
  }
  onMouseUp(event: paper.ToolEvent): void {
    // if (!this.to) {
    //   store.dispatch(setCanvasSelecting({selecting: true}));
    //   this.state = store.getState();
    // }
    if (this.to) {
      // get hit test layers
      const hitTestLayers = this.hitTestLayers();
      store.dispatch(selectLayers({layers: hitTestLayers, toggleSelected: event.modifiers.shift, noActiveArtboardUpdate: true}));
    }
    if (this.shape) {
      this.shape.remove();
    }
    // store.dispatch(disableAreaSelectToolThunk() as any);
  }
}

export default AreaSelectTool;