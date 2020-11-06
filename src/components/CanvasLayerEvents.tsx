// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { scrollToLayer } from '../utils';
import { RootState } from '../store/reducers';
import { importPaperProject, getDeepSelectItem, getNearestScopeAncestor } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { LayerTypes, SetLayerHoverPayload, DeepSelectLayerPayload, SelectLayersPayload, DeselectLayersPayload } from '../store/actionTypes/layer';
import { setLayerHover, deepSelectLayer, selectLayers, deselectLayers, deselectAllLayers } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';

interface CanvasLayerEventsProps {
  layerEvent: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
  layerItem?: Btwx.Layer;
  nearestScopeAncestor?: Btwx.Layer;
  deepSelectItem?: Btwx.Layer;
  hover?: string;
  selected?: string[];
  activeTool?: Btwx.ToolType;
  dragging?: boolean;
  resizing?: boolean;
  selecting?: boolean;
  dragHandle?: boolean;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deepSelectLayer?(payload: DeepSelectLayerPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
}

const CanvasLayerEvents = (props: CanvasLayerEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layerEvent, activeTool, dragging, resizing, selecting, hover, selected, deselectLayers, deselectAllLayers, layerItem, nearestScopeAncestor, deepSelectItem, setLayerHover, selectLayers, deepSelectLayer, setCanvasActiveTool, dragHandle } = props;

  const handleMouseMove = (): void => {
    if (layerEvent.empty) {
      if (hover !== null) {
        setLayerHover({id: null});
      }
    } else {
      if (nearestScopeAncestor.type === 'Artboard') {
        if (hover !== deepSelectItem.id) {
          setLayerHover({id: deepSelectItem.id});
        }
      } else {
        if (hover !== nearestScopeAncestor.id) {
          setLayerHover({id: nearestScopeAncestor.id});
        }
      }
      if (
        !activeTool ||
        activeTool === 'Resize' && !resizing ||
        activeTool === 'AreaSelect' && !selecting
      ) {
        setCanvasActiveTool({activeTool: 'Drag'});
      }
    }
  }

  const handleMouseDown = (): void => {
    if (layerEvent.empty) {
      if (selected.length > 0 && !layerEvent.event.shiftKey) {
        deselectAllLayers()
      }
    } else {
      if (layerEvent.event.shiftKey) {
        if (!(nearestScopeAncestor.type === 'Artboard' && selected.length > 0)) {
          if (nearestScopeAncestor.selected) {
            deselectLayers({layers: [nearestScopeAncestor.id]});
          } else {
            selectLayers({layers: [nearestScopeAncestor.id]});
          }
        }
      } else {
        if (!nearestScopeAncestor.selected || (nearestScopeAncestor.type === 'Artboard' && nearestScopeAncestor.selected)) {
          let layerId: string;
          if (nearestScopeAncestor.type === 'Artboard') {
            layerId = deepSelectItem.id;
            deepSelectLayer({id: layerItem.id})
          } else {
            layerId = nearestScopeAncestor.id;
            selectLayers({layers: [nearestScopeAncestor.id], newSelection: true});
          }
          if (layerId) {
            scrollToLayer(layerId);
          }
        }
      }
    }
  }

  const handleMouseUp = (): void => {
    return;
  }

  const handleDoubleClick = (): void => {
    if (!layerEvent.empty) {
      if (nearestScopeAncestor.id !== layerItem.id) {
        deepSelectLayer({id: layerItem.id});
        scrollToLayer(deepSelectItem.id);
      }
    }
  }

  const handleContextMenu = (): void => {
    return;
  }

  useEffect(() => {
    if (layerEvent && !dragging && !resizing && !selecting) {
      switch(layerEvent.eventType) {
        case 'contextMenu':
          handleContextMenu();
          break;
        case 'doubleClick':
          handleDoubleClick();
          break;
        case 'mouseDown':
          handleMouseDown();
          break;
        case 'mouseMove':
          handleMouseMove();
          break;
        case 'mouseUp':
          handleMouseUp();
          break;
      }
    }
  }, [layerEvent]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasLayerEventsProps): {
  layerItem: Btwx.Layer;
  nearestScopeAncestor: Btwx.Layer;
  deepSelectItem: Btwx.Layer;
  hover: string;
  selected: string[];
  activeTool: Btwx.ToolType;
  dragging: boolean;
  resizing: boolean;
  selecting: boolean;
  dragHandle: boolean;
} => {
  const { layer, canvasSettings } = state;
  const layerEvent = ownProps.layerEvent;
  const hitResult = layerEvent ? ownProps.layerEvent.hitResult : null;
  const layerItem = hitResult && !layerEvent.empty ? layer.present.byId[hitResult.item.data.type === 'Layer' ? hitResult.item.data.id : hitResult.item.parent.data.id] : null;
  const nearestScopeAncestor = layerItem ? getNearestScopeAncestor(layer.present, layerItem.id) : null;
  const deepSelectItem = layerItem ? getDeepSelectItem(layer.present, layerItem.id) : null;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  const activeTool = canvasSettings.activeTool;
  const dragging = canvasSettings.dragging;
  const resizing = canvasSettings.resizing;
  const selecting = canvasSettings.selecting;
  const dragHandle = canvasSettings.dragHandle;
  return {
    layerItem,
    nearestScopeAncestor,
    deepSelectItem,
    hover,
    selected,
    activeTool,
    dragging,
    resizing,
    selecting,
    dragHandle
  };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayers, deepSelectLayer, deselectLayers, deselectAllLayers, setCanvasActiveTool }
)(CanvasLayerEvents);