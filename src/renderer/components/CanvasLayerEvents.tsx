import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor } from '../store/selectors/layer';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { openContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, deepSelectLayerThunk, selectLayers, deselectLayers, deselectAllLayers, setActiveArtboard, setLayerTreeScroll, showLayersChildren } from '../store/actions/layer';
import { openTextEditorThunk } from '../store/actions/textEditor';
import { setTextSettings } from '../store/actions/textSettings';
import { enableVectorEditToolThunk, disableVectorEditTool, setVectorEditToolCurveHover } from '../store/actions/vectorEditTool';

interface CanvasLayerEventsProps {
  layerEvent: {
    hitResult: string;
    hitResultType: string;
    hitResultLocation: any;
    projectIndex: number;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
}

const CanvasLayerEvents = (props: CanvasLayerEventsProps): ReactElement => {
  const { layerEvent } = props;
  const layerItem = useSelector((state: RootState) => layerEvent && layerEvent.hitResult ? state.layer.present.byId[layerEvent.hitResult] : null);
  const nearestScopeAncestor = useSelector((state: RootState) => layerItem ? getNearestScopeAncestor(state.layer.present, layerItem.id) : null);
  const deepSelectItem = useSelector((state: RootState) => layerItem ? getDeepSelectItem(state.layer.present, layerItem.id) : null);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  // const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const vectorEditToolEnabled = useSelector((state: RootState) => state.vectorEditTool.isEnabled);
  const vectorEditToolLayerId = useSelector((state: RootState) => state.vectorEditTool.layerId);
  const vectorEditToolCurveHover = useSelector((state: RootState) => state.vectorEditTool.curveHover);
  const vectorEditToolSelectedSegment = useSelector((state: RootState) => state.vectorEditTool.selectedSegment);
  const vectorEditToolSelectedSegmentType = useSelector((state: RootState) => state.vectorEditTool.selectedSegmentType);
  const dispatch = useDispatch();

  const handleMouseMove = (): void => {
    if (layerEvent.empty) {
      if (hover) {
        dispatch(setLayerHover({id: null}));
      }
      if (vectorEditToolEnabled && vectorEditToolCurveHover) {
        dispatch(setVectorEditToolCurveHover({
          curveHover: null
        }));
      }
    } else {
      if (nearestScopeAncestor && nearestScopeAncestor.type === 'Artboard') {
        if (deepSelectItem && deepSelectItem.type === 'Artboard') {
          if (hover) {
            dispatch(setLayerHover({id: null}));
          }
          if (activeTool !== 'AreaSelect') {
            dispatch(setCanvasActiveTool({
              activeTool: 'AreaSelect',
              resizeHandle: null,
              dragHandle: null,
              lineHandle: null,
              gradientHandle: null,
              cursor: ['auto']
            }));
          }
        } else {
          if (deepSelectItem && (hover !== deepSelectItem.id)) {
            dispatch(setLayerHover({id: deepSelectItem.id}));
          }
          if (vectorEditToolEnabled && deepSelectItem.type === 'Shape' && layerEvent.hitResultType === 'curve') {
            dispatch(setVectorEditToolCurveHover({
              curveHover: layerEvent.hitResultLocation
            }));
          }
          if (activeTool !== 'Drag' || (activeTool === 'Drag' && dragHandle)) {
            dispatch(setCanvasActiveTool({
              activeTool: 'Drag',
              dragHandle: false,
              cursor: ['auto']
            }));
          }
        }
      } else {
        if (nearestScopeAncestor && (hover !== nearestScopeAncestor.id)) {
          dispatch(setLayerHover({id: nearestScopeAncestor.id}));
        }
        if (vectorEditToolEnabled && nearestScopeAncestor.type === 'Shape' && layerEvent.hitResultType === 'curve') {
          dispatch(setVectorEditToolCurveHover({
            curveHover: layerEvent.hitResultLocation
          }));
        }
        if (activeTool !== 'Drag' || (activeTool === 'Drag' && dragHandle)) {
          dispatch(setCanvasActiveTool({
            activeTool: 'Drag',
            dragHandle: false,
            cursor: ['auto']
          }));
        }
      }
    }
  }

  const handleMouseDown = (): void => {
    if (layerEvent.empty) {
      if (selected.length > 0 && !layerEvent.event.shiftKey) {
        dispatch(deselectAllLayers());
      }
      if (vectorEditToolEnabled) {
        dispatch(disableVectorEditTool());
      }
    } else {
      if (layerEvent.event.shiftKey) {
        if (nearestScopeAncestor.type === 'Artboard' && deepSelectItem.type !== 'Artboard') {
          if (deepSelectItem.selected) {
            dispatch(deselectLayers({
              layers: [deepSelectItem.id]
            }));
          } else {
            dispatch(showLayersChildren({
              layers: deepSelectItem.scope
            }));
            dispatch(setLayerTreeScroll({
              scroll: deepSelectItem.id
            }));
            dispatch(selectLayers({
              layers: [deepSelectItem.id]
            }));
          }
          if (deepSelectItem.type === 'Text') {
            dispatch(setTextSettings({
              ...(deepSelectItem as Btwx.Text).textStyle
            }));
          }
        }
        if (nearestScopeAncestor.type !== 'Artboard') {
          if (nearestScopeAncestor.selected) {
            dispatch(deselectLayers({
              layers: [nearestScopeAncestor.id]
            }));
          } else {
            dispatch(showLayersChildren({
              layers: nearestScopeAncestor.scope
            }));
            dispatch(setLayerTreeScroll({
              scroll: nearestScopeAncestor.id
            }));
            dispatch(selectLayers({
              layers: [nearestScopeAncestor.id]
            }));
          }
          if (nearestScopeAncestor.type === 'Text') {
            dispatch(setTextSettings({
              ...(nearestScopeAncestor as Btwx.Text).textStyle
            }));
          }
        }
      } else {
        if (nearestScopeAncestor.type === 'Artboard') {
          if (deepSelectItem.type === 'Artboard') {
            if (selected.length !== 0) {
              dispatch(deselectAllLayers());
            }
            if (activeArtboard !== deepSelectItem.id) {
              dispatch(setActiveArtboard({
                id: deepSelectItem.id
              }));
            }
          } else {
            if (deepSelectItem.type === 'Text') {
              dispatch(setTextSettings({
                ...(deepSelectItem as Btwx.Text).textStyle
              }));
            }
            if (!deepSelectItem.selected) {
              dispatch(showLayersChildren({
                layers: deepSelectItem.scope
              }));
              dispatch(setLayerTreeScroll({
                scroll: deepSelectItem.id
              }));
              dispatch(selectLayers({
                layers: [deepSelectItem.id],
                newSelection: true
              }));
            }
          }
        } else {
          if (!nearestScopeAncestor.selected) {
            dispatch(showLayersChildren({
              layers: nearestScopeAncestor.scope
            }));
            dispatch(setLayerTreeScroll({
              scroll: nearestScopeAncestor.id
            }));
            dispatch(selectLayers({
              layers: [nearestScopeAncestor.id],
              newSelection: true
            }));
          }
          if (nearestScopeAncestor.type === 'Text') {
            dispatch(setTextSettings({
              ...(nearestScopeAncestor as Btwx.Text).textStyle
            }));
          }
        }
      }
    }
  }


  const handleDoubleClick = (): void => {
    if (!layerEvent.empty) {
      if (nearestScopeAncestor.id !== layerItem.id) {
        (dispatch(deepSelectLayerThunk({id: layerItem.id})) as any).then(() => {
          // dispatch(showLayersChildren({
          //   layers: deepSelectItem.scope
          // }));
          dispatch(setLayerTreeScroll({
            scroll: deepSelectItem.id
          }));
        });
      } else {
        if (layerItem.type === 'Text') {
          dispatch(openTextEditorThunk(layerItem.id, layerEvent.projectIndex));
        }
        if (layerItem.type === 'Shape' && vectorEditToolLayerId !== layerItem.id) {
          dispatch(enableVectorEditToolThunk(layerItem.id, layerEvent.projectIndex));
        }
      }
    }
  }

  const handleContextMenu = (): void => {
    let contextMenuId = 'root';
    if (!layerEvent.empty) {
      if (nearestScopeAncestor.type === 'Artboard') {
        contextMenuId = deepSelectItem.id;
      } else {
        contextMenuId = nearestScopeAncestor.id;
      }
    }
    dispatch(openContextMenu({
      type: 'layer',
      id: contextMenuId
    }));
    if (activeTool === 'Drag' || activeTool === 'AreaSelect') {
      dispatch(setCanvasActiveTool({
        activeTool: null,
        resizeHandle: null,
        dragHandle: null,
        lineHandle: null,
        gradientHandle: null,
        cursor: ['auto']
      }));
    }
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
      }
    }
  }, [layerEvent]);

  return null;
}

export default CanvasLayerEvents;