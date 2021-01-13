import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { getDeepSelectItem, getNearestScopeAncestor, getPaperLayer } from '../store/selectors/layer';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { openContextMenu } from '../store/actions/contextMenu';
import { setLayerHover, deepSelectLayerThunk, selectLayers, deselectLayers, deselectAllLayers, setActiveArtboard } from '../store/actions/layer';
import { openTextEditor } from '../store/actions/textEditor';
import { setTextSettings } from '../store/actions/textSettings';

interface CanvasLayerEventsProps {
  layerEvent: {
    hitResult: paper.HitResult;
    projectIndex: number;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
}

const CanvasLayerEvents = (props: CanvasLayerEventsProps): ReactElement => {
  const { layerEvent } = props;
  const layerItem = useSelector((state: RootState) =>
    layerEvent && layerEvent.hitResult
    ? state.layer.present.byId[(() => {
        switch(layerEvent.hitResult.item.data.type) {
          case 'LayerContainer':
            return layerEvent.hitResult.item.children[0].data.id;
          case 'Layer':
            return layerEvent.hitResult.item.data.id;
          case 'LayerChild': {
            switch(layerEvent.hitResult.item.data.id) {
              case 'textLines':
                return layerEvent.hitResult.item.parent.data.id;
              case 'textLine':
                return layerEvent.hitResult.item.parent.parent.data.id;
              default:
                return layerEvent.hitResult.item.parent.data.id;
            }
          }
        }
      })()]
    : null
  );
  const nearestScopeAncestor = useSelector((state: RootState) => layerItem ? getNearestScopeAncestor(state.layer.present, layerItem.id) : null);
  const deepSelectItem = useSelector((state: RootState) => layerItem ? getDeepSelectItem(state.layer.present, layerItem.id) : null);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  // const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const textSettings = useSelector((state: RootState) => state.textSettings);
  const layerTreeRef = useSelector((state: RootState) => state.leftSidebar.ref);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const dispatch = useDispatch();

  const scrollToLayer = (layerId: string): void => {
    if (layerId && layerTreeRef) {
      layerTreeRef.scrollToItem(layerId);
    }
  }

  const handleMouseMove = (): void => {
    if (layerEvent.empty) {
      if (hover) {
        dispatch(setLayerHover({id: null}));
      }
    } else {
      if (nearestScopeAncestor.type === 'Artboard') {
        if (deepSelectItem.type === 'Artboard') {
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
          if (hover !== deepSelectItem.id) {
            dispatch(setLayerHover({id: deepSelectItem.id}));
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
        if (hover !== nearestScopeAncestor.id) {
          dispatch(setLayerHover({id: nearestScopeAncestor.id}));
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
    } else {
      if (layerEvent.event.shiftKey) {
        if (nearestScopeAncestor.type === 'Artboard' && deepSelectItem.type !== 'Artboard') {
          if (deepSelectItem.selected) {
            dispatch(deselectLayers({layers: [deepSelectItem.id]}));
          } else {
            scrollToLayer(deepSelectItem.id);
            dispatch(selectLayers({layers: [deepSelectItem.id]}));
          }
          if (deepSelectItem.type === 'Text') {
            dispatch(setTextSettings({...(deepSelectItem as Btwx.Text).textStyle}));
          }
        }
        if (nearestScopeAncestor.type !== 'Artboard') {
          if (nearestScopeAncestor.selected) {
            dispatch(deselectLayers({layers: [nearestScopeAncestor.id]}));
          } else {
            scrollToLayer(nearestScopeAncestor.id);
            dispatch(selectLayers({layers: [nearestScopeAncestor.id]}));
          }
          if (nearestScopeAncestor.type === 'Text') {
            dispatch(setTextSettings({...(nearestScopeAncestor as Btwx.Text).textStyle}));
          }
        }
      } else {
        if (nearestScopeAncestor.type === 'Artboard') {
          if (deepSelectItem.type === 'Artboard') {
            if (selected.length !== 0) {
              dispatch(deselectAllLayers());
            }
            if (activeArtboard !== deepSelectItem.id) {
              dispatch(setActiveArtboard({id: deepSelectItem.id}));
            }
          } else {
            if (deepSelectItem.type === 'Text') {
              dispatch(setTextSettings({...(deepSelectItem as Btwx.Text).textStyle}));
            }
            if (!deepSelectItem.selected) {
              scrollToLayer(deepSelectItem.id);
              dispatch(selectLayers({layers: [deepSelectItem.id], newSelection: true}));
            }
          }
        } else {
          if (!nearestScopeAncestor.selected) {
            scrollToLayer(nearestScopeAncestor.id);
            dispatch(selectLayers({layers: [nearestScopeAncestor.id], newSelection: true}));
          }
          if (nearestScopeAncestor.type === 'Text') {
            dispatch(setTextSettings({...(nearestScopeAncestor as Btwx.Text).textStyle}));
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
        (dispatch(deepSelectLayerThunk({id: layerItem.id})) as any).then(() => {
          scrollToLayer(deepSelectItem.id);
        });
      } else {
        if (layerItem.type === 'Text') {
          const paperLayer = getPaperLayer(layerItem.id, layerEvent.projectIndex);
          const topLeft = uiPaperScope.view.projectToView(paperLayer.bounds.topLeft);
          const topCenter = uiPaperScope.view.projectToView(paperLayer.bounds.topCenter);
          const topRight = uiPaperScope.view.projectToView(paperLayer.bounds.topRight);
          dispatch(openTextEditor({
            layer: layerItem.id,
            projectIndex: layerEvent.projectIndex,
            x: ((): number => {
              switch(textSettings.justification) {
                case 'left':
                  return topLeft.x;
                case 'center':
                  return topCenter.x;
                case 'right':
                  return topRight.x;
              }
            })(),
            y: ((): number => {
              switch(textSettings.justification) {
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
      }
    }
  }

  const handleContextMenu = (): void => {
    let contextMenuId = 'root';
    const paperPoint = uiPaperScope.view.getEventPoint(layerEvent.event);
    if (!layerEvent.empty) {
      if (nearestScopeAncestor.type === 'Artboard') {
        contextMenuId = deepSelectItem.id;
      } else {
        contextMenuId = nearestScopeAncestor.id;
      }
    }
    dispatch(openContextMenu({
      type: 'LayerEdit',
      id: contextMenuId,
      x: layerEvent.event.clientX,
      y: layerEvent.event.clientY,
      paperX: paperPoint.x,
      paperY: paperPoint.y
    }));
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

export default CanvasLayerEvents;