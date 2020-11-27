import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor, getPaperLayer } from '../store/selectors/layer';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { openContextMenu } from '../store/actions/contextMenu';
import { OpenContextMenuPayload, ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { LayerTypes, SetLayerHoverPayload, DeepSelectLayerPayload, SelectLayersPayload, DeselectLayersPayload } from '../store/actionTypes/layer';
import { setLayerHover, deepSelectLayer, deepSelectLayerThunk, selectLayers, deselectLayers, deselectAllLayers } from '../store/actions/layer';
import { openTextEditor } from '../store/actions/textEditor';
import { OpenTextEditorPayload, TextEditorTypes } from '../store/actionTypes/textEditor';
import { TextSettingsState } from '../store/reducers/textSettings';
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
  layerTreeRef?: any;
  textSettings?: TextSettingsState;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deepSelectLayer?(payload: DeepSelectLayerPayload): LayerTypes;
  deepSelectLayerThunk?(payload: DeepSelectLayerPayload): Promise<any>;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  openTextEditor?(payload: OpenTextEditorPayload): TextEditorTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
}

const CanvasLayerEvents = (props: CanvasLayerEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layerEvent, activeTool, dragging, resizing, selecting, hover, selected, deselectLayers, deselectAllLayers, layerItem, nearestScopeAncestor, deepSelectItem, setLayerHover, selectLayers, deepSelectLayer, deepSelectLayerThunk, setCanvasActiveTool, dragHandle, textSettings, openTextEditor, openContextMenu, layerTreeRef } = props;

  const scrollToLayer = (layerId: string) => {
    if (layerId && layerTreeRef) {
      layerTreeRef.scrollToItem(layerId);
    }
  }

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
      if (activeTool !== 'Drag') {
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
        if (nearestScopeAncestor.type === 'Artboard') {
          if (deepSelectItem.selected) {
            deselectLayers({layers: [deepSelectItem.id]});
          } else {
            scrollToLayer(deepSelectItem.id);
            selectLayers({layers: [deepSelectItem.id]});
          }
        }
        if (nearestScopeAncestor.type !== 'Artboard') {
          if (nearestScopeAncestor.selected) {
            deselectLayers({layers: [nearestScopeAncestor.id]});
          } else {
            scrollToLayer(nearestScopeAncestor.id);
            selectLayers({layers: [nearestScopeAncestor.id]});
          }
        }
      } else {
        if (nearestScopeAncestor.type === 'Artboard') {
          if (!deepSelectItem.selected) {
            scrollToLayer(deepSelectItem.id);
            selectLayers({layers: [deepSelectItem.id], newSelection: true});
          }
        }
        if (nearestScopeAncestor.type !== 'Artboard') {
          if (!nearestScopeAncestor.selected) {
            scrollToLayer(nearestScopeAncestor.id);
            selectLayers({layers: [nearestScopeAncestor.id], newSelection: true});
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
        // scrollToLayer(deepSelectItem.id);
        // selectLayers({layers: [deepSelectItem.id], newSelection: true});
        deepSelectLayerThunk({id: layerItem.id}).then(() => {
          scrollToLayer(deepSelectItem.id);
        });
      } else {
        if (layerItem.type === 'Text') {
          // const paperLayer = getPaperLayer(layerItem.id);
          // const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
          // const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
          // const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
          // openTextEditor({
          //   layer: layerItem.id,
          //   x: ((): number => {
          //     switch(textSettings.justification) {
          //       case 'left':
          //         return topLeft.x;
          //       case 'center':
          //         return topCenter.x;
          //       case 'right':
          //         return topRight.x;
          //     }
          //   })(),
          //   y: ((): number => {
          //     switch(textSettings.justification) {
          //       case 'left':
          //         return topLeft.y;
          //       case 'center':
          //         return topCenter.y;
          //       case 'right':
          //         return topRight.y;
          //     }
          //   })()
          // })
        }
      }
    }
  }

  const handleContextMenu = (): void => {
    // let contextMenuId = 'page';
    // const paperPoint = paperMain.view.getEventPoint(layerEvent.event);
    // if (!layerEvent.empty) {
    //   if (nearestScopeAncestor.type === 'Artboard') {
    //     contextMenuId = deepSelectItem.id;
    //   } else {
    //     contextMenuId = nearestScopeAncestor.id;
    //   }
    // }
    // openContextMenu({
    //   type: 'LayerEdit',
    //   id: contextMenuId,
    //   x: layerEvent.event.clientX,
    //   y: layerEvent.event.clientY,
    //   paperX: paperPoint.x,
    //   paperY: paperPoint.y
    // });
  }

  useEffect(() => {
    if (layerEvent && !dragging && !resizing && activeTool !== 'Artboard' && activeTool !== 'Shape' && activeTool !== 'Text') {
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
  textSettings: TextSettingsState;
  layerTreeRef: any;
} => {
  const { layer, canvasSettings, textSettings, leftSidebar } = state;
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
  const layerTreeRef = leftSidebar.ref;
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
    dragHandle,
    textSettings,
    layerTreeRef
  };
};

const mapDispatchToProps = {
  setLayerHover,
  selectLayers,
  deepSelectLayer,
  deepSelectLayerThunk,
  deselectLayers,
  deselectAllLayers,
  setCanvasActiveTool,
  openTextEditor,
  openContextMenu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasLayerEvents);