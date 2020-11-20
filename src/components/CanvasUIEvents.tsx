import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { LayerTypes, SetLayerHoverPayload } from '../store/actionTypes/layer';
import { setLayerHover } from '../store/actions/layer';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes, SetTweenDrawerEventHoverPayload } from '../store/actionTypes/tweenDrawer';

interface CanvasUIEventsProps {
  uiEvent: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
  hover?: string;
  resizing?: boolean;
  dragging?: boolean;
  selecting?: boolean;
  eventDrawerHover?: string;
  eventDrawerEvent?: string;
  activeTool?: Btwx.ToolType;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  setTweenDrawerEventHoverThunk?(payload: SetTweenDrawerEventHoverPayload): void;
  setTweenDrawerEventThunk?(payload: SetTweenDrawerEventPayload): void;
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { uiEvent, activeTool, setCanvasActiveTool, resizing, dragging, selecting, setLayerHover, hover, eventDrawerHover, setTweenDrawerEventHoverThunk, eventDrawerEvent, setTweenDrawerEventThunk } = props;

  const handleMouseMove = (): void => {
    if (uiEvent.empty) {
      if (activeTool !== 'AreaSelect' && !hover) {
        setCanvasActiveTool({
          activeTool: 'AreaSelect',
          resizeHandle: null,
          dragHandle: null,
          lineHandle: null
        });
      }
      if (eventDrawerHover !== null) {
        setTweenDrawerEventHoverThunk({id: null});
      }
    } else {
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'SelectionFrame': {
          if (hover) {
            setLayerHover({id: null});
          }
          switch(uiEvent.hitResult.item.data.interactiveType) {
            case 'move':
              if (activeTool !== 'Drag') {
                setCanvasActiveTool({
                  activeTool: 'Drag',
                  dragHandle: true,
                  resizeHandle: null,
                  lineHandle: null
                });
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
                setCanvasActiveTool({
                  activeTool: 'Resize',
                  resizeHandle: uiEvent.hitResult.item.data.interactiveType,
                  dragHandle: false,
                  lineHandle: null
                });
              }
              break;
            }
            case 'from':
            case 'to':
              if (activeTool !== 'Line') {
                setCanvasActiveTool({
                  activeTool: 'Line',
                  lineHandle: uiEvent.hitResult.item.data.interactiveType,
                  dragHandle: false,
                  resizeHandle: null
                });
              }
              break;
          }
          break;
        }
        case 'GradientFrame': {
          break;
        }
        case 'TweenEventsFrame': {
          const interactiveType = uiEvent.hitResult.item.data.interactiveType;
          if (interactiveType && eventDrawerHover !== interactiveType) {
            setTweenDrawerEventHoverThunk({id: interactiveType});
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
        case 'SelectionFrame': {
          break;
        }
        case 'GradientFrame': {
          break;
        }
        case 'TweenEventsFrame': {
          const interactiveType = uiEvent.hitResult.item.data.interactiveType;
          if (interactiveType && eventDrawerEvent !== interactiveType) {
            setTweenDrawerEventThunk({id: interactiveType});
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

const mapStateToProps = (state: RootState): {
  hover: string;
  activeTool: Btwx.ToolType;
  resizing: boolean;
  dragging: boolean;
  selecting: boolean;
  eventDrawerHover: string;
  eventDrawerEvent: string;
} => {
  const { canvasSettings, layer, tweenDrawer } = state;
  return {
    activeTool: canvasSettings.activeTool,
    resizing: canvasSettings.resizing,
    dragging: canvasSettings.dragging,
    selecting: canvasSettings.selecting,
    hover: layer.present.hover,
    eventDrawerHover: tweenDrawer.eventHover,
    eventDrawerEvent: tweenDrawer.event
  };
};

export default connect(
  mapStateToProps,
  { setCanvasActiveTool, setLayerHover, setTweenDrawerEventHoverThunk, setTweenDrawerEventThunk }
)(CanvasUIEvents);