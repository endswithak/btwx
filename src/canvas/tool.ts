import store from '../store';
import throttle from 'lodash.throttle';
import { RootState } from '../store/reducers';
import { getNearestScopeAncestor, getDeepSelectItem, getPaperLayer, getLayerAndDescendants, getLayerScope } from '../store/selectors/layer';
import { setTextSettings } from '../store/actions/textSettings';
import { setCanvasActiveTool, setCanvasDrawing } from '../store/actions/canvasSettings';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, setLayerActiveGradientStop } from '../store/actions/layer';
import { paperMain } from './index';
import { scrollToLayer } from '../utils';
import ShapeTool from './shapeTool';
import DragTool from './dragTool';
import AreaSelectTool from './areaSelectTool';
import ResizeTool from './resizeTool';
import LineTool from './lineTool';
import ArtboardTool from './artboardTool';
import GradientTool from './gradientTool';
import TextTool from './textTool';
import { openTextEditor } from '../store/actions/textEditor';
import { disableShapeTool } from '../store/actions/shapeTool';
import { disableArtboardTool } from '../store/actions/artboardTool';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';

class MasterTool {
  type: em.ToolType;
  tool: paper.Tool;
  state: RootState;
  shapeTool: ShapeTool;
  areaSelectTool: AreaSelectTool;
  dragTool: DragTool;
  resizeTool: ResizeTool;
  lineTool: LineTool;
  artboardTool: ArtboardTool;
  gradientTool: GradientTool;
  textTool: TextTool;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.minDistance = 1;
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.tool.onMouseMove = (e: paper.ToolEvent): void => this.onMouseMove(e);
    paperMain.view.onDoubleClick = (e: paper.ToolEvent): void => this.onDoubleClick(e);
    this.state = store.getState();
    this.shapeTool = new ShapeTool();
    this.areaSelectTool = new AreaSelectTool();
    this.dragTool = new DragTool();
    this.resizeTool = new ResizeTool();
    this.lineTool = new LineTool();
    this.artboardTool = new ArtboardTool();
    this.gradientTool = new GradientTool();
    this.textTool = new TextTool();
  }
  handleHitResult(event: paper.ToolEvent): em.HitResult {
    const result: em.HitResult = {
      type: 'Empty',
      event: event,
      layerProps: {
        layerItem: null,
        nearestScopeAncestor: null,
        deepSelectItem: null
      },
      uiElementProps: {
        elementId: null,
        interactive: false,
        interactiveType: null
      }
    }
    const hitResult = paperMain.project.hitTest(event.point);
    const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult) {
      if (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild') {
        result.layerProps.layerItem = this.state.layer.present.byId[hitResult.item.data.type === 'Layer' ? hitResult.item.data.id : hitResult.item.parent.data.id];
        result.type = 'Layer';
        result.layerProps.deepSelectItem = getDeepSelectItem(this.state.layer.present, result.layerProps.layerItem.id);
        result.layerProps.nearestScopeAncestor = getNearestScopeAncestor(this.state.layer.present, result.layerProps.layerItem.id);
      }
      if (hitResult.item.data.type === 'UIElement' || hitResult.item.data.type === 'UIElementChild') {
        result.type = 'UIElement';
        result.uiElementProps = {
          elementId: hitResult.item.data.elementId,
          interactive: hitResult.item.data.interactive,
          interactiveType: hitResult.item.data.interactiveType
        }
      }
    }
    return result;
  }
  handleLayerMouseDown(hitResult: em.HitResult) {
    const props = hitResult.layerProps;
    const selectedWithChildren = this.state.layer.present.selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
      const layerAndChildren = getLayerAndDescendants(this.state.layer.present, current);
      result.allIds = [...result.allIds, ...layerAndChildren];
      layerAndChildren.forEach((id) => {
        result.byId[id] = this.state.layer.present.byId[id];
      });
      return result;
    }, { allIds: [], byId: {} });
    // text settings
    if (props.nearestScopeAncestor.id === props.layerItem.id && props.layerItem.type === 'Text') {
      store.dispatch(setTextSettings({
        fillColor: (props.layerItem as em.Text).style.fill.color,
        ...(props.layerItem as em.Text).textStyle
      }));
    }
    // selecting
    if (hitResult.event.modifiers.shift) {
      if (props.nearestScopeAncestor.type === 'Artboard' && this.state.layer.present.selected.length > 0) {
        store.dispatch(setCanvasActiveTool({activeTool: 'AreaSelect', selecting: true}));
        this.areaSelectTool.onMouseDown(hitResult.event);
      } else {
        if (props.layerItem.selected) {
          store.dispatch(deselectLayer({id: props.nearestScopeAncestor.id}));
        } else {
          store.dispatch(selectLayer({id: props.nearestScopeAncestor.id}));
        }
      }
    } else {
      if (!selectedWithChildren.allIds.includes(props.layerItem.id) || (props.nearestScopeAncestor.type === 'Artboard' && props.nearestScopeAncestor.selected)) {
        let layerId: string;
        if (props.nearestScopeAncestor.type === 'Artboard') {
          layerId = props.deepSelectItem.id;
          store.dispatch(deepSelectLayer({id: props.layerItem.id}));
        } else {
          layerId = props.nearestScopeAncestor.id;
          store.dispatch(selectLayer({id: props.nearestScopeAncestor.id, newSelection: true}));
        }
        if (layerId) {
          scrollToLayer(layerId);
        }
      }
    }
    // drag tool
    if (props.nearestScopeAncestor.type !== 'Artboard' || props.deepSelectItem.type !== 'Artboard') {
      store.dispatch(setCanvasActiveTool({activeTool: 'Drag', dragging: true}));
      this.dragTool.onMouseDown(hitResult.event);
    }
    // area select tool
    if (props.nearestScopeAncestor.type === 'Artboard' && props.deepSelectItem.type === 'Artboard') {
      store.dispatch(setCanvasActiveTool({activeTool: 'AreaSelect', selecting: true}));
      this.areaSelectTool.onMouseDown(hitResult.event);
    }
  }
  handleUIElementMouseDown(hitResult: em.HitResult) {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'SelectionFrame': {
          switch(props.interactiveType) {
            case 'move':
              store.dispatch(setCanvasActiveTool({activeTool: 'Drag', dragging: true}));
              this.dragTool.handle = true;
              this.dragTool.onMouseDown(hitResult.event);
              break;
            case 'topLeft':
            case 'topCenter':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomCenter':
            case 'bottomRight':
            case 'leftCenter':
            case 'rightCenter': {
              const selectedWithChildren = this.state.layer.present.selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
                const layerAndChildren = getLayerAndDescendants(this.state.layer.present, current);
                result.allIds = [...result.allIds, ...layerAndChildren];
                layerAndChildren.forEach((id) => {
                  result.byId[id] = this.state.layer.present.byId[id];
                });
                return result;
              }, { allIds: [], byId: {} });
              if (this.state.layer.present.selected.some((id) => this.state.layer.present.byId[id].type === 'Artboard') || !selectedWithChildren.allIds.some((id: string) => this.state.layer.present.byId[id].type === 'Text' || this.state.layer.present.byId[id].type === 'Group')) {
                store.dispatch(setCanvasActiveTool({
                  activeTool: 'Resize',
                  resizing: true,
                  resizeType: (() => {
                    switch(props.interactiveType) {
                      case 'topLeft':
                      case 'bottomRight':
                        return 'nwse'
                      case 'topRight':
                      case 'bottomLeft':
                        return 'nesw'
                      case 'topCenter':
                      case 'bottomCenter':
                        return 'ns';
                      case 'leftCenter':
                      case 'rightCenter':
                        return 'ew';
                    }
                  })() as em.ResizeType
                }));
                this.resizeTool.handle = props.interactiveType;
                this.resizeTool.onMouseDown(hitResult.event);
              }
              break;
            }
            case 'from':
            case 'to':
              store.dispatch(setCanvasActiveTool({activeTool: 'Line', resizing: true, resizeType: 'ew'}));
              this.lineTool.handle = props.interactiveType;
              this.lineTool.onMouseDown(hitResult.event);
              break;
          }
          break;
        }
        case 'GradientFrame': {
          const gradient = (this.state.layer.present.byId[this.state.gradientEditor.layers[0]].style[this.state.gradientEditor.prop] as em.Fill | em.Stroke).gradient;
          const stopsWithIndex = gradient.stops.map((stop, index) => {
            return { ...stop, index };
          });
          const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
          const originStop = sortedStops[0];
          const destinationStop = sortedStops[sortedStops.length - 1];
          switch(props.interactiveType) {
            case 'origin':
              store.dispatch(setLayerActiveGradientStop({stopIndex: originStop.index, id: this.state.gradientEditor.layers[0], prop: this.state.gradientEditor.prop as 'fill' | 'stroke'}));
              break;
            case 'destination':
              store.dispatch(setLayerActiveGradientStop({stopIndex: destinationStop.index, id: this.state.gradientEditor.layers[0], prop: this.state.gradientEditor.prop as 'fill' | 'stroke'}));
              break;
          }
          store.dispatch(setCanvasActiveTool({activeTool: 'Gradient', resizing: true}));
          this.gradientTool.handle = props.interactiveType as em.GradientHandle;
          this.gradientTool.prop = this.state.gradientEditor.prop as 'fill' | 'stroke';
          this.gradientTool.onMouseDown(hitResult.event);
          break;
        }
        case 'TweenEventsFrame': {
          break;
        }
      }
    }
  }
  handleEmptyMouseDown(hitResult: em.HitResult) {
    if (this.state.layer.present.selected.length > 0 && !hitResult.event.modifiers.shift) {
      store.dispatch(deselectAllLayers());
    }
    store.dispatch(setCanvasActiveTool({activeTool: 'AreaSelect', selecting: true}));
    this.areaSelectTool.onMouseDown(hitResult.event);
  }
  handleLayerMouseMove(hitResult: em.HitResult): void {
    const props = hitResult.layerProps;
    if (this.state.layer.present.hover !== props.nearestScopeAncestor.id) {
      store.dispatch(setLayerHover({id: props.nearestScopeAncestor.id}))
    }
  }
  handleUIElementMouseMove(hitResult: em.HitResult) {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'TweenEventsFrame': {
          if (props.interactiveType && this.state.tweenDrawer.eventHover !== props.interactiveType) {
            store.dispatch(setTweenDrawerEventHoverThunk({id: props.interactiveType}) as any);
          }
          break;
        }
      }
    }
  }
  handleEmptyMouseMove(hitResult: em.HitResult): void {
    if (this.state.layer.present.hover !== null) {
      store.dispatch(setLayerHover({id: null}));
    }
  }
  handleLayerDoubleClick(hitResult: em.HitResult) {
    const props = hitResult.layerProps;
    if (props.nearestScopeAncestor.id !== props.layerItem.id) {
      store.dispatch(deepSelectLayer({id: props.layerItem.id}));
    } else {
      switch(props.layerItem.type) {
        case 'Text': {
          this.handleTextDoubleClick(hitResult);
          break;
        }
      }
    }
  }
  handleTextDoubleClick(hitResult: em.HitResult) {
    const paperLayer = getPaperLayer(hitResult.layerProps.layerItem.id);
    const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
    const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
    const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
    store.dispatch(openTextEditor({
      layer: hitResult.layerProps.layerItem.id,
      x: (() => {
        switch(this.state.textSettings.justification) {
          case 'left':
            return topLeft.x;
          case 'center':
            return topCenter.x;
          case 'right':
            return topRight.x;
        }
      })(),
      y: (() => {
        switch(this.state.textSettings.justification) {
          case 'left':
            return topLeft.y;
          case 'center':
            return topCenter.y;
          case 'right':
            return topRight.y;
        }
      })()
    }));
  }
  handleUIElementDoubleClick(hitResult: em.HitResult) {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'TweenEventsFrame': {
          store.dispatch(setTweenDrawerEventThunk({id: props.interactiveType}) as any);
          break;
        }
      }
    }
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(this.type) {
      case 'Shape':
        this.shapeTool.onKeyDown(event);
        break;
      case 'AreaSelect':
        this.areaSelectTool.onKeyDown(event);
        break;
      case 'Drag':
        this.dragTool.onKeyDown(event);
        break;
      case 'Resize':
        this.resizeTool.onKeyDown(event);
        break;
      case 'Gradient':
        this.gradientTool.onKeyDown(event);
        break;
      case 'Line':
        this.lineTool.onKeyDown(event);
        break;
      case 'Text':
        this.textTool.onKeyDown(event);
        break;
      case 'Artboard':
        this.artboardTool.onKeyDown(event);
        break;
      default:
        break;
    }
  }
  onKeyUp(event: paper.KeyEvent): void {
    switch(this.type) {
      case 'Shape':
        this.shapeTool.onKeyUp(event);
        break;
      case 'AreaSelect':
        this.areaSelectTool.onKeyUp(event);
        break;
      case 'Drag':
        this.dragTool.onKeyUp(event);
        break;
      case 'Resize':
        this.resizeTool.onKeyUp(event);
        break;
      case 'Gradient':
        this.gradientTool.onKeyUp(event);
        break;
      case 'Line':
        this.lineTool.onKeyUp(event);
        break;
      case 'Text':
        this.textTool.onKeyUp(event);
        break;
      case 'Artboard':
        this.artboardTool.onKeyUp(event);
        break;
      default:
        break;
    }
  }
  onMouseMove(event: paper.ToolEvent): void {
    if (!this.state.contextMenu.isOpen && (!this.state.canvasSettings.dragging || !this.state.canvasSettings.selecting || !this.state.canvasSettings.resizing || !this.state.canvasSettings.drawing)) {
      switch(this.type) {
        case 'Shape':
          this.shapeTool.onMouseMove(event);
          break;
        case 'Artboard':
          this.artboardTool.onMouseMove(event);
          break;
        case 'Text':
          this.textTool.onMouseMove(event);
          break;
        default: {
          const hitResult = this.handleHitResult(event);
          switch(hitResult.type) {
            case 'Layer':
              this.handleLayerMouseMove(hitResult);
              break;
            case 'UIElement':
              this.handleUIElementMouseMove(hitResult);
              break;
            case 'Empty':
              this.handleEmptyMouseMove(hitResult);
              break;
          }
          if (this.state.tweenDrawer.eventHover !== null && (hitResult.type === 'Empty' || hitResult.type === 'Layer' || (hitResult.type === 'UIElement' && hitResult.uiElementProps.elementId !== 'TweenEventsFrame'))) {
            store.dispatch(setTweenDrawerEventHoverThunk({id: null}) as any);
          }
          break;
        }
      }
    }
  }
  onMouseDown(event: paper.ToolEvent): void {
    const hitResult = this.handleHitResult(event);
    switch(this.type) {
      case 'Shape':
        store.dispatch(setCanvasDrawing({drawing: true}));
        this.shapeTool.onMouseDown(event);
        break;
      case 'Artboard':
        store.dispatch(setCanvasDrawing({drawing: true}));
        this.artboardTool.onMouseDown(event);
        break;
      case 'Text':
        this.textTool.onMouseDown(event);
        store.dispatch(setCanvasActiveTool({activeTool: null}));
        this.textTool = new TextTool();
        break;
      default: {
        switch(hitResult.type) {
          case 'Layer':
            this.handleLayerMouseDown(hitResult);
            break;
          case 'UIElement':
            this.handleUIElementMouseDown(hitResult);
            break;
          case 'Empty':
            this.handleEmptyMouseDown(hitResult);
            break;
        }
        break;
      }
    }
    // handle context menu
    if ((hitResult.event as any).event.which === 3) {
      let contextMenuId = 'page';
      if (hitResult.type === 'Layer') {
        const props = hitResult.layerProps;
        if (props.nearestScopeAncestor.type === 'Artboard') {
          contextMenuId = props.deepSelectItem.id;
        } else {
          contextMenuId = props.nearestScopeAncestor.id;
        }
      }
      store.dispatch(openContextMenu({
        type: 'LayerEdit',
        id: contextMenuId,
        x: (hitResult.event as any).event.clientX,
        y: (hitResult.event as any).event.clientY,
        paperX: hitResult.event.point.x,
        paperY: hitResult.event.point.y
      }));
    }
  }
  onMouseDrag(event: paper.ToolEvent): void {
    switch(this.type) {
      case 'Shape':
        this.shapeTool.onMouseDrag(event);
        break;
      case 'AreaSelect':
        this.areaSelectTool.onMouseDrag(event);
        break;
      case 'Drag':
        this.dragTool.onMouseDrag(event);
        break;
      case 'Resize':
        this.resizeTool.onMouseDrag(event);
        break;
      case 'Gradient':
        this.gradientTool.onMouseDrag(event);
        break;
      case 'Line':
        this.lineTool.onMouseDrag(event);
        break;
      case 'Artboard':
        this.artboardTool.onMouseDrag(event);
        break;
      default: {
        const hitResult = this.handleHitResult(event);
        switch(hitResult.type) {
          case 'Layer':
            break;
          case 'UIElement':
            break;
          case 'Empty':
            break;
        }
        break;
      }
    }
  }
  onMouseUp(event: paper.ToolEvent): void {
    switch(this.type) {
      case 'Shape':
        this.shapeTool.onMouseUp(event);
        store.dispatch(disableShapeTool());
        store.dispatch(setCanvasActiveTool({activeTool: null, drawing: false}));
        this.shapeTool = new ShapeTool();
        break;
      case 'Artboard':
        this.artboardTool.onMouseUp(event);
        store.dispatch(disableArtboardTool());
        store.dispatch(setCanvasActiveTool({activeTool: null, drawing: false}));
        this.artboardTool = new ArtboardTool();
        break;
      case 'AreaSelect':
        this.areaSelectTool.onMouseUp(event);
        store.dispatch(setCanvasActiveTool({activeTool: null, selecting: false}));
        this.areaSelectTool = new AreaSelectTool();
        break;
      case 'Drag':
        this.dragTool.onMouseUp(event);
        store.dispatch(setCanvasActiveTool({activeTool: null, dragging: false}));
        this.dragTool = new DragTool();
        break;
      case 'Resize':
        this.resizeTool.onMouseUp(event);
        store.dispatch(setCanvasActiveTool({activeTool: null, resizing: false, resizeType: null}));
        this.resizeTool = new ResizeTool();
        break;
      case 'Gradient':
        this.gradientTool.onMouseUp(event);
        store.dispatch(setCanvasActiveTool({activeTool: null, resizing: false}));
        this.gradientTool = new GradientTool();
        break;
      case 'Line':
        this.lineTool.onMouseUp(event);
        store.dispatch(setCanvasActiveTool({activeTool: null, resizing: false, resizeType: null}));
        this.lineTool = new LineTool();
        break;
      default: {
        const hitResult = this.handleHitResult(event);
        switch(hitResult.type) {
          case 'Layer':
            break;
          case 'UIElement':
            break;
          case 'Empty':
            break;
        }
        break;
      }
    }
  }
  onDoubleClick(event: paper.ToolEvent): void {
    const hitResult = this.handleHitResult(event);
    switch(hitResult.type) {
      case 'Layer': {
        this.handleLayerDoubleClick(hitResult);
        break;
      }
      case 'UIElement': {
        this.handleUIElementDoubleClick(hitResult);
        break;
      }
    }
  }
}

export default MasterTool;