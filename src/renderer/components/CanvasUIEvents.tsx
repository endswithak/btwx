import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool, setCanvasCursor } from '../store/actions/canvasSettings';
import { setLayerHover, setLayerActiveGradientStop, selectLayers, deselectLayers, setLayerTreeScroll, deselectLayerEvents, selectLayerEvents } from '../store/actions/layer';
import { getAllArtboardItems } from '../store/selectors/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { setEventDrawerEventThunk, setEventDrawerEventHoverThunk } from '../store/actions/eventDrawer';

export const getSelectionFrameCursor = (handle): Btwx.CanvasCursor => {
  switch(handle) {
    case 'move':
      return 'move';
    case 'lineMove':
      return 'move';
    case 'topLeft':
    case 'bottomRight':
      return 'nwse-resize';
    case 'topRight':
    case 'bottomLeft':
      return 'nesw-resize';
    case 'topCenter':
    case 'bottomCenter':
      return 'ns-resize';
    case 'leftCenter':
    case 'rightCenter':
    case 'lineFrom':
    case 'lineTo':
      return 'ew-resize';
    default:
      return 'move';
  }
}

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
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const selectedEvents = useSelector((state: RootState) => state.layer.present.events.selected);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const gradientHandle = useSelector((state: RootState) => state.canvasSettings.gradientHandle);
  const cursor = useSelector((state: RootState) => state.canvasSettings.cursor);
  const artboardItems = useSelector((state: RootState) => getAllArtboardItems(state));
  // const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const eventDrawerHover = useSelector((state: RootState) => state.eventDrawer.eventHover);
  const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const gradientEditorProp = useSelector((state: RootState) => state.gradientEditor.prop);
  const dispatch = useDispatch();

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
        dispatch(setEventDrawerEventHoverThunk({
          id: null
        }));
        dispatch(setCanvasCursor({
          cursor: cursor.filter(c => c !== 'pointer')
        }));
      }
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'scrollFrame': {
          if (hover) {
            dispatch(setLayerHover({
              id: null
            }));
          }
          switch(interactiveType) {
            case 'topLeft':
            case 'topCenter':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomCenter':
            case 'bottomRight':
            case 'leftCenter':
            case 'rightCenter': {
              if (activeTool !== 'ScrollFrame') {
                dispatch(setCanvasActiveTool({
                  activeTool: 'ScrollFrame',
                  resizeHandle: interactiveType,
                  dragHandle: false,
                  lineHandle: null,
                  cursor: [getSelectionFrameCursor(interactiveType), ...cursor]
                }));
              }
              break;
            }
          }
          break;
        }
        case 'selectionFrame': {
          if (hover) {
            dispatch(setLayerHover({
              id: null
            }));
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
                  resizeHandle: interactiveType,
                  dragHandle: false,
                  lineHandle: null,
                  cursor: [getSelectionFrameCursor(interactiveType), ...cursor]
                }));
              }
              break;
            }
            case 'lineFrom':
            case 'lineTo':
              if (activeTool !== 'Line') {
                dispatch(setCanvasActiveTool({
                  activeTool: 'Line',
                  lineHandle: interactiveType,
                  dragHandle: false,
                  resizeHandle: null,
                  cursor: [getSelectionFrameCursor(interactiveType), ...cursor]
                }));
              }
              break;
          }
          break;
        }
        case 'gradientFrame': {
          if (hover) {
            dispatch(setLayerHover({
              id: null
            }));
          }
          if (activeTool !== 'Gradient' || (activeTool === 'Gradient' && interactiveType && gradientHandle !== interactiveType)) {
            dispatch(setCanvasActiveTool({
              activeTool: 'Gradient',
              gradientHandle: interactiveType,
              cursor: ['move', ...cursor]
            }));
          }
          break;
        }
        case 'eventsFrame': {
          if (interactiveType && eventDrawerHover !== interactiveType) {
            dispatch(setEventDrawerEventHoverThunk({
              id: interactiveType
            }));
            if (cursor[0] !== 'pointer' && !eventDrawerEvent) {
              dispatch(setCanvasCursor({
                cursor: ['pointer', ...cursor]
              }));
            }
          }
          break;
        }
        case 'namesFrame': {
          if (interactiveType && hover !== interactiveType) {
            dispatch(setLayerHover({
              id: interactiveType
            }));
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
      if (selectedEvents.length > 0 && !uiEvent.event.shiftKey) {
        dispatch(deselectLayerEvents({
          events: selectedEvents
        }));
      }
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'eventsFrame': {
          const isSelected = selectedEvents.includes(interactiveType);
          if (uiEvent.event.shiftKey) {
            if (isSelected) {
              dispatch(deselectLayerEvents({
                events: [interactiveType]
              }));
            } else {
              dispatch(selectLayerEvents({
                events: [interactiveType]
              }));
            }
          } else {
            if (!isSelected) {
              dispatch(selectLayerEvents({
                events: [interactiveType],
                newSelection: true
              }));
            }
          }
          break;
        }
        case 'gradientFrame': {
          if (interactiveType && interactiveType !== 'connector') {
            dispatch(setLayerActiveGradientStop({
              id: selected[0],
              prop: gradientEditorProp,
              stopIndex: uiEvent.hitResult.item.data.stopIndex
            }));
          }
          break;
        }
        case 'namesFrame': {
          if (interactiveType) {
            const artboardItem = artboardItems[interactiveType];
            if (uiEvent.event.shiftKey) {
              if (artboardItem.selected) {
                dispatch(deselectLayers({
                  layers: [interactiveType]
                }));
              } else {
                dispatch(setLayerTreeScroll({
                  scroll: interactiveType
                }));
                dispatch(selectLayers({
                  layers: [interactiveType]
                }));
              }
            } else {
              if (!selected.includes(interactiveType)) {
                dispatch(setLayerTreeScroll({
                  scroll: interactiveType
                }));
                dispatch(selectLayers({
                  layers: [interactiveType],
                  newSelection: true
                }));
              }
            }
          }
          break;
        }
      }
    }
  }

  const handleDoubleClick = (): void => {
    if (uiEvent.empty) {
      return;
    } else {
      const interactiveType = uiEvent.hitResult.item.data.interactiveType;
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'eventsFrame': {
          if (interactiveType && eventDrawerEvent !== interactiveType) {
            dispatch(setEventDrawerEventThunk({
              id: interactiveType
            }));
            dispatch(setCanvasCursor({
              cursor: ['auto']
            }));
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
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'eventsFrame': {
          if (interactiveType) {
            (window as any).api.openEventContextMenu(JSON.stringify({
              instanceId,
              template: [
                ...selectedEvents.length === 1
                ? [{
                    label: 'Edit Event...',
                    click: {
                      id: 'setEventDrawerEventThunk',
                      params: { id: interactiveType }
                    }
                  }]
                : [],
                ...selectedEvents.length > 0
                ? [{
                    label: `Remove ${selectedEvents.length === 1 ? 'Event' : `${selectedEvents.length} Events`}`,
                    click: {
                      id: 'removeLayersEvent',
                      params: {
                        events: selectedEvents
                      }
                    }
                  }]
                : []
              ]
            }));
          }
          break;
        }
        case 'namesFrame': {
          if (interactiveType) {
            dispatch(openContextMenu({
              type: 'layer',
              id: interactiveType
            }));
          }
          break;
        }
      }
    }
    if (activeTool) {
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
      }
    }
  }, [uiEvent]);

  return null;
}

export default CanvasUIEvents;