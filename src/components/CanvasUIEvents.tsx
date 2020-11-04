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
  activeTool?: Btwx.ToolType;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { uiEvent, activeTool, setCanvasActiveTool, resizing, dragging, setLayerHover, hover } = props;

  const handleMouseMove = (): void => {
    if (uiEvent.empty) {
      if (activeTool === 'Resize' && !resizing) {
        setCanvasActiveTool({activeTool: null, resizeHandle: null});
      }
      if (activeTool === 'Drag' && !dragging) {
        setCanvasActiveTool({activeTool: null, dragHandle: false});
      }
      return;
    } else {
      if (hover) {
        setLayerHover({id: null});
      }
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'SelectionFrame': {
          switch(uiEvent.hitResult.item.data.interactiveType) {
            case 'move':
              if (!activeTool || activeTool === 'Drag' && !dragging || activeTool === 'Resize' && !resizing) {
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
              if (!activeTool || activeTool === 'Drag' && !dragging) {
                setCanvasActiveTool({activeTool: 'Resize', resizeHandle: uiEvent.hitResult.item.data.interactiveType});
              }
              break;
            }
            case 'from':
            case 'to':
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
    if (uiEvent) {
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
} => {
  const { canvasSettings, layer } = state;
  return {
    activeTool: canvasSettings.activeTool,
    resizing: canvasSettings.resizing,
    dragging: canvasSettings.dragging,
    hover: layer.present.hover
  };
};

export default connect(
  mapStateToProps,
  { setCanvasActiveTool, setLayerHover }
)(CanvasUIEvents);