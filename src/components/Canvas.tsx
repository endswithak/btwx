import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetLayerHoverPayload, SelectLayerPayload, DeselectLayerPayload, DeepSelectLayerPayload, LayerTypes, SetLayerActiveGradientStopPayload } from '../store/actionTypes/layer';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, setLayerActiveGradientStop } from '../store/actions/layer';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { OpenTextEditorPayload, TextEditorTypes } from '../store/actionTypes/textEditor';
import { openTextEditor } from '../store/actions/textEditor';
import { LayerState } from '../store/reducers/layer';
import { SetTextSettingsPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettings } from '../store/actions/textSettings';
import { toggleDragToolThunk } from '../store/actions/dragTool';
import { toggleResizeToolThunk } from '../store/actions/resizeTool';
import { toggleAreaSelectToolThunk } from '../store/actions/areaSelectTool';
import { toggleLineToolThunk } from '../store/actions/lineTool';
import { toggleGradientToolThunk } from '../store/actions/gradientTool';
import { EnableZoomToolPayload, SetZoomToolTypePayload } from '../store/actionTypes/zoomTool';
import { enableZoomToolThunk, setZoomToolType } from '../store/actions/zoomTool';
import { CanvasSettingsTypes, SetCanvasMousePositionPayload } from '../store/actionTypes/canvasSettings';
import { setCanvasMousePosition } from '../store/actions/canvasSettings';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { getNearestScopeAncestor, getDeepSelectItem, getPaperLayer, getLayerAndDescendants } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import gradientEditor, { GradientEditorState } from '../store/reducers/gradientEditor';
import { SetTweenDrawerEventPayload, SetTweenDrawerEventHoverPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { setTweenDrawerEvent, openTweenDrawer, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';
import { scrollToLayer } from '../utils';
import { ThemeContext } from './ThemeProvider';


interface CanvasProps {
  ready: boolean;
  tweenDrawerOpen?: boolean;
  tweenDrawerEventHover?: string;
  gradientEditor?: GradientEditorState;
  noActiveTool?: boolean;
  cursor?: string;
  scope?: string[];
  layer?: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  selected?: string[];
  hover?: string;
  textJustification?: string;
  zooming?: boolean;
  zoomType?: em.ZoomType;
  dragging?: boolean;
  resizing?: boolean;
  selecting?: boolean;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  deselectLayer?(payload: DeselectLayerPayload): LayerTypes;
  deepSelectLayer?(payload: DeepSelectLayerPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  closeContextMenu?(): ContextMenuTypes;
  openTextEditor?(payload: OpenTextEditorPayload): TextEditorTypes;
  setTextSettings?(payload: SetTextSettingsPayload): TextSettingsTypes;
  toggleSelectionToolThunk?(nativeEvent: any, hitResult: em.HitResult): void;
  toggleDragToolThunk?(handle: boolean, nativeEvent: any): void;
  toggleResizeToolThunk?(handle: em.ResizeHandle, nativeEvent: any): void;
  toggleLineToolThunk?(handle: em.LineHandle, nativeEvent: any): void;
  toggleGradientToolThunk?(handle: em.GradientHandle, nativeEvent: any): void;
  toggleAreaSelectToolThunk?(nativeEvent: any): void;
  setCanvasMousePosition?(payload: SetCanvasMousePositionPayload): CanvasSettingsTypes;
  setLayerActiveGradientStop?(payload: SetLayerActiveGradientStopPayload): LayerTypes;
  setTweenDrawerEvent?(payload: SetTweenDrawerEventPayload): TweenDrawerTypes;
  openTweenDrawer?(): TweenDrawerTypes;
  setTweenDrawerEventHoverThunk?(payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes;
  enableZoomToolThunk?(payload: EnableZoomToolPayload): void;
  setZoomToolType?(payload: SetZoomToolTypePayload): void;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { toggleGradientToolThunk, toggleLineToolThunk, toggleResizeToolThunk, toggleAreaSelectToolThunk, toggleDragToolThunk, ready, enableZoomToolThunk, setZoomToolType, tweenDrawerEventHover, setTweenDrawerEventHoverThunk, openTweenDrawer, tweenDrawerOpen, setTweenDrawerEvent, gradientEditor, setLayerActiveGradientStop, setCanvasMousePosition, cursor, noActiveTool, zooming, dragging, resizing, selecting, zoomType, scope, layer, textJustification, setTextSettings, selected, hover, setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, openContextMenu, closeContextMenu, openTextEditor, toggleSelectionToolThunk } = props;

  const handleHitResult = (point: paper.Point, includeNearestScopeAncestor?: boolean): em.HitResult => {
    const result: em.HitResult = {
      type: null,
      layerProps: {
        layerItem: null,
        nearestScopeAncestor: null
      },
      uiElementProps: {
        elementId: null,
        interactive: false,
        interactiveType: null
      }
    }
    const hitResult = paperMain.project.hitTest(point);
    const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type;
    if (validHitResult) {
      if (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild') {
        result.layerProps.layerItem = layer.byId[hitResult.item.data.type === 'Layer' ? hitResult.item.data.id : hitResult.item.parent.data.id];
        result.type = 'Layer';
        if (includeNearestScopeAncestor) {
          result.layerProps.nearestScopeAncestor = getNearestScopeAncestor({scope, ...layer} as any, result.layerProps.layerItem.id);
        }
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

  const handleLayerSidebarScroll = (layerId: string) => {
    scrollToLayer(layerId);
  }

  const handleLayerMouseDown = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.layerProps;
    const deepSelectItem = getDeepSelectItem({scope, ...layer} as any, props.layerItem.id);
    // text settings
    if (props.nearestScopeAncestor.id === props.layerItem.id && props.layerItem.type === 'Text') {
      setTextSettings({
        fillColor: (props.layerItem as em.Text).style.fill.color,
        ...(props.layerItem as em.Text).textStyle
      });
    }
    // selecting
    if (e.shiftKey) {
      if (props.layerItem.selected) {
        deselectLayer({id: props.nearestScopeAncestor.id});
      } else {
        selectLayer({id: props.nearestScopeAncestor.id});
      }
    } else {
      if (!props.layerItem.selected) {
        let layerId: string;
        if (props.nearestScopeAncestor.type === 'Artboard') {
          layerId = deepSelectItem.id;
          deepSelectLayer({id: props.layerItem.id});
        } else {
          layerId = props.nearestScopeAncestor.id;
          selectLayer({id: props.nearestScopeAncestor.id, newSelection: true});
        }
        if (layerId) {
          handleLayerSidebarScroll(layerId);
        }
      }
    }
    // drag tool
    if (props.nearestScopeAncestor.type !== 'Artboard' || deepSelectItem.type !== 'Artboard') {
      toggleDragToolThunk(false, e);
    }
    // area select tool
    if (props.nearestScopeAncestor.type === 'Artboard' && deepSelectItem.type === 'Artboard') {
      toggleAreaSelectToolThunk(e);
    }
  }

  const handleUIElementMouseDown = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'SelectionFrame': {
          switch(props.interactiveType) {
            case 'move':
              toggleDragToolThunk(true, e);
              break;
            case 'topLeft':
            case 'topCenter':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomCenter':
            case 'bottomRight':
            case 'leftCenter':
            case 'rightCenter': {
              const selectedWithChildren = selected.reduce((result: { allIds: string[]; byId: { [id: string]: em.Layer } }, current) => {
                const layerAndChildren = getLayerAndDescendants(layer as LayerState, current);
                result.allIds = [...result.allIds, ...layerAndChildren];
                layerAndChildren.forEach((id) => {
                  result.byId[id] = layer.byId[id];
                });
                return result;
              }, { allIds: [], byId: {} });
              if (selected.some((id) => layer.byId[id].type === 'Artboard') || !selectedWithChildren.allIds.some((id: string) => layer.byId[id].type === 'Text' || layer.byId[id].type === 'Group')) {
                toggleResizeToolThunk(props.interactiveType, e);
              }
              break;
            }
            case 'from':
            case 'to':
              toggleLineToolThunk(props.interactiveType, e);
              break;
          }
          break;
        }
        case 'GradientFrame': {
          const gradient = (layer.byId[gradientEditor.layers[0]].style[gradientEditor.prop] as em.Fill | em.Stroke).gradient;
          const stopsWithIndex = gradient.stops.map((stop, index) => {
            return { ...stop, index };
          });
          const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
          const originStop = sortedStops[0];
          const destinationStop = sortedStops[sortedStops.length - 1];
          switch(props.interactiveType) {
            case 'origin':
              setLayerActiveGradientStop({stopIndex: originStop.index, id: gradientEditor.layers[0], prop: gradientEditor.prop as 'fill' | 'stroke'});
              toggleGradientToolThunk(props.interactiveType, e);
              break;
            case 'destination':
              setLayerActiveGradientStop({stopIndex: destinationStop.index, id: gradientEditor.layers[0], prop: gradientEditor.prop as 'fill' | 'stroke'});
              toggleGradientToolThunk(props.interactiveType, e);
              break;
          }
          break;
        }
        case 'TweenEventsFrame': {
          break;
        }
      }
    }
  }

  const handleMouseDown = (e: any) => {
    const paperPoint = paperMain.view.getEventPoint(e);
    const hitResult = handleHitResult(paperPoint, true);
    switch(hitResult.type) {
      case 'Layer': {
        handleLayerMouseDown(e, hitResult);
        break;
      }
      case 'UIElement': {
        handleUIElementMouseDown(e, hitResult);
        break;
      }
      default: {
        if (selected.length > 0 && !e.shiftKey) {
          deselectAllLayers();
        }
        toggleAreaSelectToolThunk(e);
        break;
      }
    }
  }

  const handleTextDoubleClick = (e: any, layerItem: em.Text) => {
    const paperLayer = getPaperLayer(layerItem.id);
    const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
    const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
    const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
    openTextEditor({
      layer: layerItem.id,
      x: (() => {
        switch(textJustification) {
          case 'left':
            return topLeft.x;
          case 'center':
            return topCenter.x;
          case 'right':
            return topRight.x;
        }
      })(),
      y: (() => {
        switch(textJustification) {
          case 'left':
            return topLeft.y;
          case 'center':
            return topCenter.y;
          case 'right':
            return topRight.y;
        }
      })()
    });
  }

  const handleLayerDoubleClick = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.layerProps;
    if (props.nearestScopeAncestor.id !== props.layerItem.id) {
      deepSelectLayer({id: props.layerItem.id});
    } else {
      switch(props.layerItem.type) {
        case 'Text': {
          handleTextDoubleClick(e, props.layerItem as em.Text);
          break;
        }
      }
    }
  }

  const handleUIElementDoubleClick = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'TweenEventsFrame': {
          if (!tweenDrawerOpen) {
            openTweenDrawer();
          }
          setTweenDrawerEvent({id: props.interactiveType});
          break;
        }
      }
    }
  }

  const handleDoubleClick = (e: any) => {
    const paperPoint = paperMain.view.getEventPoint(e);
    const hitResult = handleHitResult(paperPoint, true);
    switch(hitResult.type) {
      case 'Layer': {
        handleLayerDoubleClick(e, hitResult);
        break;
      }
      case 'UIElement': {
        handleUIElementDoubleClick(e, hitResult);
        break;
      }
    }
  }

  const handleContextMenu = (e: any) => {
    let contextMenuId = 'page';
    const paperPoint = paperMain.view.getEventPoint(e);
    const hitResult = handleHitResult(paperPoint, true);
    switch(hitResult.type) {
      case 'Layer': {
        const props = hitResult.layerProps;
        if (props.nearestScopeAncestor.type === 'Artboard') {
          contextMenuId = getDeepSelectItem({scope, ...layer} as any, props.layerItem.id).id;
        } else {
          contextMenuId = props.nearestScopeAncestor.id;
        }
        if (!selected.includes(contextMenuId)) {
          if (props.nearestScopeAncestor.type === 'Artboard') {
            deepSelectLayer({id: props.layerItem.id});
          } else {
            selectLayer({id: props.nearestScopeAncestor.id, newSelection: true});
          }
          handleLayerSidebarScroll(contextMenuId);
        }
        break;
      }
      default: {
        if (selected.length > 0) {
          deselectAllLayers();
        }
        break;
      }
    }
    openContextMenu({
      type: 'LayerEdit',
      id: contextMenuId,
      x: e.clientX,
      y: e.clientY,
      paperX: paperPoint.x,
      paperY: paperPoint.y
    });
  }

  const handleLayerMouseMove = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.layerProps;
    if (hover !== props.nearestScopeAncestor.id) {
      setLayerHover({id: props.nearestScopeAncestor.id});
    }
  }

  const handleUIElementMouseMove = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'TweenEventsFrame': {
          if (props.interactiveType && tweenDrawerEventHover !== props.interactiveType) {
            setTweenDrawerEventHoverThunk({id: props.interactiveType});
          }
          break;
        }
      }
    }
  }

  const handleMouseMove = (e: any) => {
    const paperPoint = paperMain.view.getEventPoint(e);
    if (!selecting && !dragging && !resizing) {
      const hitResult = handleHitResult(paperPoint, true);
      switch(hitResult.type) {
        case 'Layer': {
          handleLayerMouseMove(e, hitResult);
          break;
        }
        case 'UIElement': {
          handleUIElementMouseMove(e, hitResult);
          break;
        }
        default: {
          if (hover !== null) {
            setLayerHover({id: null});
          }
          break;
        }
      }
      if (tweenDrawerEventHover !== null && (!hitResult.type || hitResult.type === 'Layer' || (hitResult.type === 'UIElement' && hitResult.uiElementProps.elementId !== 'TweenEventsFrame'))) {
        setTweenDrawerEventHoverThunk({id: null});
      }
    }
    setCanvasMousePosition({mouse: {x: e.clientX, y: e.clientY, paperX: paperPoint.x, paperY: paperPoint.y}});
  }

  const handleMouseLeave = (e: any) => {
    setCanvasMousePosition({mouse: null});
  }

  const handleWheel = (e: any): void => {
    if (e.ctrlKey) {
      if (!zooming) {
        enableZoomToolThunk({zoomType: e.deltaY < 0 ? 'in' : 'out'});
      }
      const cursorPoint = paperMain.view.getEventPoint(e as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      const prevZoom = paperMain.view.zoom;
      const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
      if (e.deltaY < 0 && nextZoom < 30) {
        if (zoomType !== 'in') {
          setZoomToolType({zoomType: 'in'})
        }
        paperMain.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        if (zoomType !== 'out') {
          setZoomToolType({zoomType: 'out'})
        }
        paperMain.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom < 0) {
        paperMain.view.zoom = 0.01;
      }
      const zoomDiff = paperMain.view.zoom - prevZoom;
      paperMain.view.translate(
        new paperMain.Point(
          ((zoomDiff * pointDiff.x) * ( 1 / paperMain.view.zoom)) * -1,
          ((zoomDiff * pointDiff.y) * ( 1 / paperMain.view.zoom)) * -1
        )
      );
    } else {
      paperMain.view.translate(
        new paperMain.Point(
          (e.deltaX * ( 1 / paperMain.view.zoom)) * -1,
          (e.deltaY * ( 1 / paperMain.view.zoom)) * -1
        )
      );
    }
  }

  return (
    <canvas
      id='canvas'
      onMouseDown={ready && noActiveTool ? handleMouseDown : null}
      onDoubleClick={ready && noActiveTool ? handleDoubleClick : null}
      onContextMenu={ready ? handleContextMenu : null}
      onMouseMove={ready && noActiveTool ? handleMouseMove : null}
      onMouseLeave={ready && noActiveTool ? handleMouseLeave : null}
      onWheel={ready ? handleWheel : null}
      tabIndex={0}
      style={{
        background: theme.background.z0,
        cursor: cursor
      }} />
  );
}

const mapStateToProps = (state: RootState): {
  tweenDrawerOpen: boolean;
  tweenDrawerEventHover: string;
  gradientEditor: GradientEditorState;
  noActiveTool: boolean;
  cursor: string;
  scope: string[];
  layer: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  selected: string[];
  hover: string;
  textJustification: string;
  zooming: boolean;
  zoomType: em.ZoomType;
  dragging: boolean;
  resizing: boolean;
  selecting: boolean;
} => {
  const { canvasSettings, layer, textSettings, gradientEditor, tweenDrawer, zoomTool, resizeTool, lineTool } = state;
  const activeTool = canvasSettings.activeTool;
  const cursor = (() => {
    switch(activeTool) {
      case 'Shape':
      case 'Artboard':
        return 'crosshair';
      case 'Text':
        return 'text';
      case 'Drag':
        return canvasSettings.dragging ? 'move' : null;
      case 'Resize':
        return `${resizeTool.cursor}-resize`;
      case 'Line':
        return `${lineTool.cursor}-resize`;
      default:
        return canvasSettings.zooming ? `zoom-${zoomTool.zoomType}` : null;
    }
  })();
  return {
    cursor,
    gradientEditor,
    scope: layer.present.scope,
    layer: {
      allIds: layer.present.allIds,
      byId: layer.present.byId
    },
    selected: layer.present.selected,
    hover: layer.present.hover,
    textJustification: textSettings.justification,
    zooming: canvasSettings.zooming,
    zoomType: zoomTool.zoomType,
    dragging: canvasSettings.dragging,
    resizing: canvasSettings.resizing,
    selecting: canvasSettings.selecting,
    noActiveTool: !activeTool,
    tweenDrawerOpen: tweenDrawer.isOpen,
    tweenDrawerEventHover: tweenDrawer.eventHover
  };
};

export default connect(
  mapStateToProps,
  { toggleGradientToolThunk, toggleLineToolThunk, toggleResizeToolThunk, toggleAreaSelectToolThunk, toggleDragToolThunk, setTweenDrawerEventHoverThunk, openTweenDrawer, setTweenDrawerEvent, setCanvasMousePosition, setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, openContextMenu, closeContextMenu, openTextEditor, setTextSettings, setLayerActiveGradientStop, enableZoomToolThunk, setZoomToolType }
)(Canvas);