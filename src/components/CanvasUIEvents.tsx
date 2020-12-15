import React, { useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { setLayerHover, setLayerActiveGradientStop } from '../store/actions/layer';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';

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
  const selecting = useSelector((state: RootState) => state.canvasSettings.selecting);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const eventDrawerHover = useSelector((state: RootState) => state.tweenDrawer.eventHover);
  const eventDrawerEvent = useSelector((state: RootState) => state.tweenDrawer.event);
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
          gradientHandle: null
        }));
      }
      if (eventDrawerHover !== null) {
        // setTweenDrawerEventHoverThunk({id: null});
      }
    } else {
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          if (hover) {
            dispatch(setLayerHover({id: null}));
          }
          switch(uiEvent.hitResult.item.data.interactiveType) {
            case 'move':
            case 'lineMove':
              if (activeTool !== 'Drag') {
                dispatch(setCanvasActiveTool({
                  activeTool: 'Drag',
                  dragHandle: true,
                  resizeHandle: null,
                  lineHandle: null
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
                  lineHandle: null
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
                  resizeHandle: null
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
              gradientHandle: uiEvent.hitResult.item.data.interactiveType
            }));
          }
          break;
        }
        case 'TweenEventsFrame': {
          const interactiveType = uiEvent.hitResult.item.data.interactiveType;
          if (interactiveType && eventDrawerHover !== interactiveType) {
            dispatch(setTweenDrawerEventHoverThunk({id: interactiveType}));
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
        case 'tweenEventsFrame': {
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
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          break;
        }
        case 'gradientFrame': {
          break;
        }
        case 'tweenEventsFrame': {
          const interactiveType = uiEvent.hitResult.item.data.interactiveType;
          if (interactiveType && eventDrawerEvent !== interactiveType) {
            dispatch(setTweenDrawerEventThunk({id: interactiveType}));
          }
          break;
        }
      }
    }
  }

  const handleContextMenu = (): void => {
    return;
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