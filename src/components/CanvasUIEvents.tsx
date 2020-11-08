// import { remote } from 'electron';
import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { LayerTypes, SetLayerHoverPayload } from '../store/actionTypes/layer';
import { setLayerHover } from '../store/actions/layer';

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
  activeTool?: Btwx.ToolType;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { uiEvent, activeTool, setCanvasActiveTool, resizing, dragging, selecting, setLayerHover, hover } = props;

  const handleMouseMove = (): void => {
    if (uiEvent.empty) {
      if (
        activeTool === 'Resize' && !resizing ||
        activeTool === 'Drag' && !dragging ||
        !activeTool
      ) {
        setCanvasActiveTool({activeTool: 'AreaSelect', resizeHandle: null, dragHandle: null});
      }
    } else {
      if (hover) {
        setLayerHover({id: null});
      }
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'SelectionFrame': {
          switch(uiEvent.hitResult.item.data.interactiveType) {
            case 'move':
              if (
                !activeTool ||
                activeTool === 'Drag' && !dragging ||
                activeTool === 'Resize' && !resizing ||
                activeTool === 'AreaSelect' && !selecting ||
                activeTool === 'Line' && !resizing
              ) {
                setCanvasActiveTool({activeTool: 'Drag', dragHandle: true});
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
              if (
                !activeTool ||
                activeTool === 'Drag' && !dragging ||
                activeTool === 'AreaSelect' && !selecting ||
                activeTool === 'Line' && !resizing
              ) {
                setCanvasActiveTool({activeTool: 'Resize', resizeHandle: uiEvent.hitResult.item.data.interactiveType});
              }
              break;
            }
            case 'from':
            case 'to':
              if (
                !activeTool ||
                activeTool === 'Drag' && !dragging ||
                activeTool === 'Resize' && !resizing ||
                activeTool === 'AreaSelect' && !selecting
              ) {
                setCanvasActiveTool({activeTool: 'Line', resizeHandle: uiEvent.hitResult.item.data.interactiveType});
              }
              break;
          }
          break;
        }
        case 'GradientFrame': {
          break;
        }
        case 'TweenEventsFrame': {
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
      return;
    }
  }

  const handleContextMenu = (): void => {
    return;
  }

  useEffect(() => {
    if (uiEvent && !dragging && !resizing && !selecting) {
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
} => {
  const { canvasSettings, layer } = state;
  return {
    activeTool: canvasSettings.activeTool,
    resizing: canvasSettings.resizing,
    dragging: canvasSettings.dragging,
    selecting: canvasSettings.selecting,
    hover: layer.present.hover
  };
};

export default connect(
  mapStateToProps,
  { setCanvasActiveTool, setLayerHover }
)(CanvasUIEvents);