import React, { useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { setCanvasActiveTool } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { LayerTypes, SetLayerHoverPayload, SetLayerActiveGradientStopPayload } from '../store/actionTypes/layer';
import { setLayerHover, setLayerActiveGradientStop } from '../store/actions/layer';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload, TweenDrawerTypes, SetTweenDrawerEventHoverPayload } from '../store/actionTypes/tweenDrawer';

interface CanvasUIEventsProps {
  uiEvent: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
  selected?: string[];
  hover?: string;
  resizing?: boolean;
  dragging?: boolean;
  selecting?: boolean;
  eventDrawerHover?: string;
  eventDrawerEvent?: string;
  activeTool?: Btwx.ToolType;
  gradientEditorProp?: 'fill' | 'stroke';
  setLayerActiveGradientStop?(payload: SetLayerActiveGradientStopPayload): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  setTweenDrawerEventHoverThunk?(payload: SetTweenDrawerEventHoverPayload): void;
  setTweenDrawerEventThunk?(payload: SetTweenDrawerEventPayload): void;
}

const CanvasUIEvents = (props: CanvasUIEventsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { uiEvent, activeTool, setCanvasActiveTool, resizing, dragging, selecting, setLayerHover, hover, selected, eventDrawerHover, setTweenDrawerEventHoverThunk, eventDrawerEvent, setTweenDrawerEventThunk, setLayerActiveGradientStop, gradientEditorProp } = props;

  const handleMouseMove = (): void => {
    if (uiEvent.empty) {
      if (activeTool !== 'AreaSelect' && !hover) {
        setCanvasActiveTool({
          activeTool: 'AreaSelect',
          resizeHandle: null,
          dragHandle: null,
          lineHandle: null,
          gradientHandle: null
        });
      }
      if (eventDrawerHover !== null) {
        // setTweenDrawerEventHoverThunk({id: null});
      }
    } else {
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          if (hover) {
            setLayerHover({id: null});
          }
          switch(uiEvent.hitResult.item.data.interactiveType) {
            case 'move':
            case 'lineMove':
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
            case 'lineFrom':
            case 'lineTo':
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
        case 'gradientFrame': {
          if (hover) {
            setLayerHover({id: null});
          }
          if (activeTool !== 'Gradient') {
            setCanvasActiveTool({
              activeTool: 'Gradient',
              gradientHandle: uiEvent.hitResult.item.data.interactiveType
            });
          }
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
      switch(uiEvent.hitResult.item.data.elementId) {
        case 'selectionFrame': {
          break;
        }
        case 'gradientFrame': {
          setLayerActiveGradientStop({
            id: selected[0],
            prop: gradientEditorProp,
            stopIndex: uiEvent.hitResult.item.data.stopIndex
          });
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
  selected: string[];
  hover: string;
  activeTool: Btwx.ToolType;
  resizing: boolean;
  dragging: boolean;
  selecting: boolean;
  eventDrawerHover: string;
  eventDrawerEvent: string;
  gradientEditorProp: 'fill' | 'stroke';
} => {
  const { canvasSettings, layer, tweenDrawer, gradientEditor } = state;
  return {
    selected: layer.present.selected,
    activeTool: canvasSettings.activeTool,
    resizing: canvasSettings.resizing,
    dragging: canvasSettings.dragging,
    selecting: canvasSettings.selecting,
    hover: layer.present.hover,
    eventDrawerHover: tweenDrawer.eventHover,
    eventDrawerEvent: tweenDrawer.event,
    gradientEditorProp: gradientEditor.prop
  };
};

export default connect(
  mapStateToProps,
  {
    setCanvasActiveTool,
    setLayerHover,
    setTweenDrawerEventHoverThunk,
    setTweenDrawerEventThunk,
    setLayerActiveGradientStop
  }
)(CanvasUIEvents);