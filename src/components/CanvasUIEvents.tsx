import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool, setCanvasCursor } from '../store/actions/canvasSettings';
import { setLayerHover, setLayerActiveGradientStop, selectLayers, deselectLayers } from '../store/actions/layer';
import { getAllArtboardItems } from '../store/selectors/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { setEventDrawerEventThunk, setEventDrawerEventHoverThunk } from '../store/actions/eventDrawer';

interface CanvasUIEventsProps {
  uiEvent: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const { uiEvent } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const cursor = useSelector((state: RootState) => state.canvasSettings.cursor);
  const artboardItems = useSelector((state: RootState) => getAllArtboardItems(state));
  const layerTreeRef = useSelector((state: RootState) => state.leftSidebar.ref);
  // const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const eventDrawerHover = useSelector((state: RootState) => state.eventDrawer.eventHover);
  const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const gradientEditorProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const dispatch = useDispatch();

  const scrollToLayer = (layerId: string): void => {
    if (layerId && layerTreeRef) {
      layerTreeRef.scrollToItem(layerId);
    }
  }

  const getSelectionFrameCursor = (): Btwx.CanvasCursor[] => {
    switch(uiEvent.hitResult.item.data.interactiveType) {
      case 'move':
        return ['move', ...cursor];
      case 'lineMove':
        return ['move', ...cursor];
      case 'topLeft':
      case 'bottomRight':
        return ['nwse-resize', ...cursor];
      case 'topRight':
      case 'bottomLeft':
        return ['nesw-resize', ...cursor];
      case 'topCenter':
      case 'bottomCenter':
        return ['ns-resize', ...cursor];
      case 'leftCenter':
      case 'rightCenter':
      case 'lineFrom':
      case 'lineTo':
        return ['ew-resize', ...cursor];
    }
  }

  const handleMouseMove = (): void => {
    if (uiEvent.empty) {
      if (activeTool !== 'AreaSelect' && !hover) {
        dispatch(setCanvasActiveTool({
          activeTool: 'AreaSelect',
          resizeHandle: null,
          dragHandle: null,
          lineHandle: null,
          gradientHandle: null,
          cursor: ['auto']
        }));
      }
      if (eventDrawerHover !== null) {
        dispatch(setEventDrawerEventHoverThunk({id: null}));
        dispatch(setCanvasCursor({cursor: cursor.filter(c => c !== 'pointer')}));
      }
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          if (hover) {
            dispatch(setLayerHover({id: null}));
          }
          switch(interactiveType) {
            case 'move':
            case 'lineMove':
              if (activeTool !== 'Drag' || (activeTool === 'Drag' && !dragHandle)) {
                dispatch(setCanvasActiveTool({
                  activeTool: 'Drag',
                  dragHandle: true,
                  resizeHandle: null,
                  lineHandle: null,
                  cursor: ['move', ...cursor]
                }));
              }
              break;
            case 'topLeft':
            case 'topCenter':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomCenter':
            case 'bottomRight':
            case 'leftCenter':
            case 'rightCenter': {
              if (activeTool !== 'Resize') {
                dispatch(setCanvasActiveTool({
                  activeTool: 'Resize',
                  resizeHandle: uiEvent.hitResult.item.data.interactiveType,
                  dragHandle: false,
                  lineHandle: null,
                  cursor: getSelectionFrameCursor()
                }));
              }
              break;
            }
            case 'lineFrom':
            case 'lineTo':
              if (activeTool !== 'Line') {
                dispatch(setCanvasActiveTool({
                  activeTool: 'Line',
                  lineHandle: uiEvent.hitResult.item.data.interactiveType,
                  dragHandle: false,
                  resizeHandle: null,
                  cursor: getSelectionFrameCursor()
                }));
              }
              break;
          }
          break;
        }
        case 'gradientFrame': {
          if (hover) {
            dispatch(setLayerHover({id: null}));
          }
          if (activeTool !== 'Gradient') {
            dispatch(setCanvasActiveTool({
              activeTool: 'Gradient',
              gradientHandle: uiEvent.hitResult.item.data.interactiveType,
              cursor: ['move', ...cursor]
            }));
          }
          break;
        }
        case 'eventsFrame': {
          if (interactiveType && eventDrawerHover !== interactiveType) {
            dispatch(setEventDrawerEventHoverThunk({id: interactiveType}));
            if (cursor[0] !== 'pointer' && !eventDrawerEvent) {
              dispatch(setCanvasCursor({cursor: ['pointer', ...cursor]}));
            }
          }
          break;
        }
        case 'namesFrame': {
          if (interactiveType && hover !== interactiveType) {
            dispatch(setLayerHover({id: interactiveType}));
          }
          if (activeTool !== 'Drag') {
            dispatch(setCanvasActiveTool({
              activeTool: 'Drag',
              dragHandle: false,
              resizeHandle: null,
              lineHandle: null,
              cursor: ['move', ...cursor]
            }));
          }
          break;
        }
      }
    }
  }

  const handleMouseDown = (): void => {
    if (uiEvent.empty) {
      return;
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          break;
        }
        case 'gradientFrame': {
          dispatch(setLayerActiveGradientStop({
            id: selected[0],
            prop: gradientEditorProp,
            stopIndex: uiEvent.hitResult.item.data.stopIndex
          }));
          break;
        }
        case 'eventsFrame': {
          break;
        }
        case 'namesFrame': {
          if (interactiveType) {
            const artboardItem = artboardItems[interactiveType];
            if (uiEvent.event.shiftKey) {
              if (artboardItem.selected) {
                dispatch(deselectLayers({layers: [interactiveType]}));
              } else {
                scrollToLayer(interactiveType);
                dispatch(selectLayers({layers: [interactiveType]}));
              }
            } else {
              if (!selected.includes(interactiveType)) {
                scrollToLayer(interactiveType);
                dispatch(selectLayers({layers: [interactiveType], newSelection: true}));
              }
            }
          }
          break;
        }
      }
      return;
    }
  }

  const handleMouseUp = (): void => {
    return;
  }

  const handleDoubleClick = (): void => {
    if (uiEvent.empty) {
      return;
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          break;
        }
        case 'gradientFrame': {
          break;
        }
        case 'eventsFrame': {
          if (interactiveType && eventDrawerEvent !== interactiveType) {
            dispatch(setEventDrawerEventThunk({id: interactiveType}));
            dispatch(setCanvasCursor({cursor: ['auto']}));
          }
          break;
        }
      }
    }
  }

  const handleContextMenu = (): void => {
    if (uiEvent.empty) {
      return;
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      const paperPoint = uiPaperScope.view.getEventPoint(uiEvent.event);
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          break;
        }
        case 'gradientFrame': {
          break;
        }
        case 'eventsFrame': {
          if (interactiveType) {
            dispatch(openContextMenu({
              type: 'EventDrawerEvent',
              id: interactiveType,
              x: uiEvent.event.clientX,
              y: uiEvent.event.clientY,
              paperX: paperPoint.x,
              paperY: paperPoint.y
            }));
          }
          break;
        }
        case 'namesFrame': {
          if (interactiveType) {
            dispatch(openContextMenu({
              type: 'LayerEdit',
              id: interactiveType,
              x: uiEvent.event.clientX,
              y: uiEvent.event.clientY,
              paperX: paperPoint.x,
              paperY: paperPoint.y
            }));
          }
          break;
        }
      }
    }
  }

  useEffect(() => {
    if (uiEvent && !dragging && !resizing && activeTool !== 'Artboard' && activeTool !== 'Shape' && activeTool !== 'Text') {
      switch(uiEvent.eventType) {
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
  }, [uiEvent]);

  return (
    <></>
  );
}

export default CanvasUIEvents;