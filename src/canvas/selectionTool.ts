import { getLayerAndDescendants } from '../store/selectors/layer';
import { setCanvasMeasuring } from '../store/actions/canvasSettings';
import { disableActiveToolThunk } from '../store/actions/tool';
import store from '../store';
import AreaSelectTool from './areaSelectTool';
import DragTool from './dragTool';
import ResizeTool from './resizeTool';
import GradientTool from './gradientTool';
import LineTool from './lineTool';
import UndoRedoTool from './undoRedoTool';
import { paperMain } from './index';
import { RootState } from '../store/reducers';

class SelectionTool {
  tool: paper.Tool;
  hitResult: paper.HitResult;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  resizeTool: ResizeTool;
  gradientTool: GradientTool;
  lineTool: LineTool;
  undoRedoTool: UndoRedoTool;
  dragging: boolean;
  resizing: boolean;
  selecting: boolean;
  measuring: boolean;
  constructor(nativeEvent: any, hitResult: em.HitResult) {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.minDistance = 1;
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.areaSelectTool = new AreaSelectTool();
    this.dragTool = new DragTool();
    this.resizeTool = new ResizeTool();
    this.gradientTool = new GradientTool();
    this.undoRedoTool = new UndoRedoTool();
    this.lineTool = new LineTool();
    this.dragging = false;
    this.resizing = false;
    this.selecting = false;
    this.measuring = false;
    if (nativeEvent) {
      const event = {
        ...nativeEvent,
        point: paperMain.view.getEventPoint(nativeEvent),
        modifiers: {
          shift: nativeEvent.shiftKey,
          alt: nativeEvent.altKey,
          meta: nativeEvent.metaKey,
          ctrl: nativeEvent.ctrlKey
        }
      };
      this.onMouseDown(event, hitResult);
    }
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.resizeTool.onKeyDown(event);
    this.areaSelectTool.onKeyDown(event);
    this.dragTool.onKeyDown(event);
  }
  // onKeyDown(event: paper.KeyEvent): void {
  //   this.resizeTool.onKeyDown(event);
  //   this.areaSelectTool.onKeyDown(event);
  //   this.dragTool.onKeyDown(event);
  //   this.copyTool.onKeyDown(event);
  //   this.groupTool.onKeyDown(event);
  //   this.insertTool.onKeyDown(event);
  //   this.undoRedoTool.onKeyDown(event);
  //   this.lineTool.onKeyDown(event);
  //   switch(event.key) {
  //     case 'alt': {
  //       if (!this.measuring && !this.dragging && !this.resizing && !this.selecting) {
  //         this.measuring = true;
  //         store.dispatch(setCanvasMeasuring({measuring: true}));
  //       }
  //       break;
  //     }
  //     case 'escape': {
  //       const state = store.getState();
  //       if (state.canvasSettings.focusing) {
  //         store.dispatch(escapeLayerScope());
  //         if (state.layer.present.hover) {
  //           const paperLayer = getPaperLayer(state.layer.present.hover);
  //           paperLayer.emit('mouseenter', event);
  //         }
  //       }
  //       break;
  //     }
  //     case 'backspace': {
  //       const state = store.getState();
  //       if (state.layer.present.selected.length > 0 && state.canvasSettings.focusing) {
  //         if (state.tweenDrawer.isOpen && state.tweenDrawer.event) {
  //           const tweenEvent = state.layer.present.tweenEventById[state.tweenDrawer.event];
  //           let layersAndChildren: string[] = [];
  //           state.layer.present.selected.forEach((id) => {
  //             layersAndChildren = [...layersAndChildren, ...getLayerAndDescendants(state.layer.present, id)];
  //           });
  //           if (layersAndChildren.includes(tweenEvent.layer) || layersAndChildren.includes(tweenEvent.artboard) || layersAndChildren.includes(tweenEvent.destinationArtboard)) {
  //             store.dispatch(setTweenDrawerEvent({id: null}));
  //           }
  //         }
  //         store.dispatch(removeLayers({layers: state.layer.present.selected}));
  //       }
  //       break;
  //     }
  //   }
  // }
  onKeyUp(event: paper.KeyEvent): void {
    this.resizeTool.onKeyUp(event);
    this.areaSelectTool.onKeyUp(event);
    this.dragTool.onKeyUp(event);
  }
  handleMouseDownLayerHitResult(state: RootState, event: paper.ToolEvent, hitResult: em.HitResult) {
    switch(hitResult.layerProps.layerItem.type) {
      case 'Shape':
      case 'Image':
      case 'Text':
      case 'Group':
        if (this.measuring) {
          this.measuring = false;
          store.dispatch(setCanvasMeasuring({measuring: false}));
        }
        this.dragging = true;
        this.dragTool.enable(state, event);
        this.dragTool.onMouseDown(event);
        break;
      case 'Artboard':
        if (this.measuring) {
          this.measuring = false;
          store.dispatch(setCanvasMeasuring({measuring: false}));
        }
        this.selecting = true;
        this.areaSelectTool.enable(state);
        this.areaSelectTool.onMouseDown(event);
        break;
    }
  }
  handleMouseDownUIElementHitResult(state: RootState, event: paper.ToolEvent, hitResult: em.HitResult) {
    if (hitResult.uiElementProps.interactive) {
      switch(hitResult.uiElementProps.elementId) {
        case 'SelectionFrame': {
          switch(hitResult.uiElementProps.interactiveType) {
            case 'move': {
              if (this.measuring) {
                this.measuring = false;
                store.dispatch(setCanvasMeasuring({measuring: false}));
              }
              this.dragging = true;
              this.dragTool.enable(state, event, true);
              this.dragTool.onMouseDown(event);
              break;
            }
            case 'topLeft':
            case 'topCenter':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomCenter':
            case 'bottomRight':
            case 'leftCenter':
            case 'rightCenter': {
              const selectedWithChildren = state.layer.present.selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
                const layerAndChildren = getLayerAndDescendants(state.layer.present, current);
                result.allIds = [...result.allIds, ...layerAndChildren];
                layerAndChildren.forEach((id) => {
                  result.byId[id] = state.layer.present.byId[id];
                });
                return result;
              }, { allIds: [], byId: {} });
              if (state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Artboard') || !selectedWithChildren.allIds.some((id: string) => state.layer.present.byId[id].type === 'Text' || state.layer.present.byId[id].type === 'Group')) {
                if (this.measuring) {
                  this.measuring = false;
                  store.dispatch(setCanvasMeasuring({measuring: false}));
                }
                this.resizing = true;
                this.resizeTool.enable(state, hitResult.uiElementProps.interactiveType);
                this.resizeTool.onMouseDown(event);
              }
              break;
            }
            case 'from':
            case 'to': {
              this.lineTool.enable(state, hitResult.uiElementProps.interactiveType);
              this.lineTool.onMouseDown(event);
              break;
            }
          }
          break;
        }
        case 'GradientFrame': {
          switch(hitResult.uiElementProps.interactiveType) {
            case 'origin':
            case 'destination': {
              this.gradientTool.enable(hitResult.uiElementProps.interactiveType, state.gradientEditor.prop as 'fill' | 'stroke');
              this.gradientTool.onMouseDown(event);
              break;
            }
          }
          break;
        }
      }
    }
  }
  onMouseDown(event: any, hitResult?: em.HitResult): void {
    const state = store.getState();
    switch(hitResult.type) {
      case 'Layer':
        this.handleMouseDownLayerHitResult(state, event, hitResult);
        break;
      case 'UIElement':
        this.handleMouseDownUIElementHitResult(state, event, hitResult);
        break;
      default: {
        if (!state.gradientEditor.isOpen) {
          this.areaSelectTool.enable(state);
          this.areaSelectTool.onMouseDown(event);
        }
      }
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseDrag(event);
    this.dragTool.onMouseDrag(event);
    this.resizeTool.onMouseDrag(event);
    this.gradientTool.onMouseDrag(event);
    this.lineTool.onMouseDrag(event);
  }
  onMouseUp(event: paper.ToolEvent): void {
    this.areaSelectTool.onMouseUp(event);
    this.dragTool.onMouseUp(event);
    this.resizeTool.onMouseUp(event);
    this.gradientTool.onMouseUp(event);
    this.lineTool.onMouseUp(event);
    if (this.measuring) {
      this.measuring = false;
    }
    if (this.dragging) {
      this.dragging = false;
    }
    if (this.resizing) {
      this.resizing = false;
    }
    store.dispatch(disableActiveToolThunk() as any);
  }
}

export default SelectionTool;