import React, { useRef, useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { RootState } from '../store/reducers';
import { SetLayerHoverPayload, SelectLayerPayload, DeselectLayerPayload, DeepSelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers } from '../store/actions/layer';
import { openContextMenu, closeContextMenu } from '../store/actions/contextMenu';
import { OpenTextEditorPayload, TextEditorTypes } from '../store/actionTypes/textEditor';
import { openTextEditor } from '../store/actions/textEditor';
import { SetTextSettingsPayload, TextSettingsTypes } from '../store/actionTypes/textSettings';
import { setTextSettings } from '../store/actions/textSettings';
import { toggleSelectionToolThunk } from '../store/actions/tool';
import { ToolTypes } from '../store/actionTypes/tool';
import { SetCanvasZoomingPayload, SetCanvasZoomingTypePayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { setCanvasZooming, setCanvasZoomingType } from '../store/actions/canvasSettings';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { getNearestScopeAncestor, getDeepSelectItem, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(ScrollToPlugin);

interface CanvasProps {
  noActiveTools?: boolean;
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
  zoomingType?: em.ZoomingType;
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
  setCanvasZooming?(payload: SetCanvasZoomingPayload): CanvasSettingsTypes;
  setCanvasZoomingType(payload: SetCanvasZoomingTypePayload): CanvasSettingsTypes;
  toggleSelectionToolThunk?(nativeEvent: any, hitResult: em.HitResult): ToolTypes;
}

const Canvas = (props: CanvasProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { cursor, noActiveTools, zooming, dragging, resizing, selecting, zoomingType, setCanvasZooming, setCanvasZoomingType, scope, layer, textJustification, setTextSettings, selected, hover, setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, openContextMenu, closeContextMenu, openTextEditor, toggleSelectionToolThunk } = props;

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
    const leftSidebar = document.getElementById('sidebar-scroll-left');
    const layerDomItem = document.getElementById(layerId);
    if (layerDomItem) {
      gsap.set(leftSidebar, {
        scrollTo: layerDomItem
      });
    }
  }

  const handleLayerMouseDown = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.layerProps;
    if (props.nearestScopeAncestor.id === props.layerItem.id && props.layerItem.type === 'Text') {
      setTextSettings({
        fillColor: (props.layerItem as em.Text).style.fill.color,
        ...(props.layerItem as em.Text).textStyle
      });
    }
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
          layerId = getDeepSelectItem({scope, ...layer} as any, props.layerItem.id).id;
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
  }

  const handleUIElementMouseDown = (e: any, hitResult: em.HitResult) => {
    const props = hitResult.uiElementProps;
    if (props.interactive) {
      switch(props.elementId) {
        case 'SelectionFrame': {
          switch(props.interactiveType) {
            case 'move':
              // enableDragToolThunk(e, true);
              break;
          }
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
        break;
      }
    }
    toggleSelectionToolThunk(e, hitResult);
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

  const handleDoubleClick = (e: any) => {
    const paperPoint = paperMain.view.getEventPoint(e);
    const hitResult = handleHitResult(paperPoint, true);
    switch(hitResult.type) {
      case 'Layer': {
        handleLayerDoubleClick(e, hitResult);
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

  const handleMouseMove = (e: any) => {
    if (!selecting && !dragging && !resizing) {
      const paperPoint = paperMain.view.getEventPoint(e);
      const hitResult = handleHitResult(paperPoint, true);
      switch(hitResult.type) {
        case 'Layer': {
          const props = hitResult.layerProps;
          if (hover !== props.nearestScopeAncestor.id) {
            setLayerHover({id: props.nearestScopeAncestor.id});
          }
          break;
        }
        default: {
          if (hover !== null) {
            setLayerHover({id: null});
          }
          break;
        }
      }
    }
  }

  const handleWheel = (e: any): void => {
    if (e.ctrlKey) {
      if (!zooming) {
        setCanvasZooming({zooming: true});
      }
      const cursorPoint = paperMain.view.getEventPoint(e as any);
      const pointDiff = new paperMain.Point(cursorPoint.x - paperMain.view.center.x, cursorPoint.y - paperMain.view.center.y);
      const prevZoom = paperMain.view.zoom;
      const nextZoom = paperMain.view.zoom - e.deltaY * 0.01;
      if (e.deltaY < 0 && nextZoom < 30) {
        if (zoomingType !== 'in') {
          setCanvasZoomingType({zoomingType: 'in'});
        }
        paperMain.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        if (zoomingType !== 'out') {
          setCanvasZoomingType({zoomingType: 'out'});
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
      onMouseDown={noActiveTools ? handleMouseDown : null}
      onDoubleClick={noActiveTools ? handleDoubleClick : null}
      onContextMenu={handleContextMenu}
      onMouseMove={noActiveTools ? handleMouseMove : null}
      onWheel={handleWheel}
      tabIndex={0}
      style={{
        background: theme.background.z0,
        cursor: cursor
      }} />
  );
}

const mapStateToProps = (state: RootState): {
  noActiveTools: boolean;
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
  zoomingType: em.ZoomingType;
  dragging: boolean;
  resizing: boolean;
  selecting: boolean;
} => {
  const { tool, canvasSettings, layer, textSettings } = state;
  const cursor = (() => {
    if (tool.type === 'Shape' || tool.type === 'Artboard') {
      return 'crosshair';
    }
    if (tool.type === 'Text') {
      return 'text'
    }
    if (canvasSettings.selecting) {
      return 'default';
    }
    if (canvasSettings.resizing) {
      return `${canvasSettings.resizingType}-resize`;
    }
    if (canvasSettings.dragging) {
      return 'move';
    }
    if (canvasSettings.zooming) {
      return `zoom-${canvasSettings.zoomingType}`;
    }
  })();
  return {
    cursor,
    scope: layer.present.scope,
    layer: {
      allIds: layer.present.allIds,
      byId: layer.present.byId
    },
    selected: layer.present.selected,
    hover: layer.present.hover,
    textJustification: textSettings.justification,
    zooming: canvasSettings.zooming,
    zoomingType: canvasSettings.zoomingType,
    dragging: canvasSettings.dragging,
    resizing: canvasSettings.resizing,
    selecting: canvasSettings.selecting,
    noActiveTools: !tool.type
  };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayer, deselectLayer, deepSelectLayer, deselectAllLayers, openContextMenu, closeContextMenu, openTextEditor, setTextSettings, setCanvasZooming, setCanvasZoomingType, toggleSelectionToolThunk }
)(Canvas);