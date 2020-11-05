/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getHoverBounds, getPaperLayer, getPaperLayersBounds, getSelectionBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers, updateSelectionFrame } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';

interface DragToolProps {
  hover?: string;
  selected?: string[];
  isEnabled?: boolean;
  dragging?: boolean;
  dragHandle?: boolean;
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
  moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
}

const DragTool = (props: DragToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, hover, dragHandle, setCanvasDragging, dragging, selected, moveLayersBy, duplicateLayers, removeDuplicatedLayers} = props;
  const [tool, setTool] = useState<paper.Tool>(null);

  const [originalSelection, setOriginalSelection] = useState<string[]>(null);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [duplicateSelection, setDuplicateSelection] = useState<string[]>(null);

  const [fromEvent, setFromEvent] = useState<paper.ToolEvent>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);

  const [toEvent, setToEvent] = useState<paper.ToolEvent>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);

  const [endEvent, setEndEvent] = useState<paper.ToolEvent>(null);

  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);

  const [keyDownEvent, setKeyDownEvent] = useState<paper.KeyEvent>(null);
  const [keyUpEvent, setKeyUpEvent] = useState<paper.KeyEvent>(null);

  const resetState = (): void => {
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setFromEvent(null);
    setFromBounds(null);
    setToEvent(null);
    setToBounds(null);
    setEndEvent(null);
    setSnapBounds(null);
    setOriginalPaperSelection(null);
    setKeyUpEvent(null);
    setKeyDownEvent(null);
  }

  const translateLayers = (): void => {
    const translate = {
      x: toBounds.center.x - fromBounds.center.x,
      y: toBounds.center.y - fromBounds.center.y
    };
    selected.forEach((id, index) => {
      const paperLayer = getPaperLayer(id);
      const copyLayer = originalPaperSelection[index];
      paperLayer.position.x = copyLayer.position.x + translate.x;
      paperLayer.position.y = copyLayer.position.y + translate.y;
    });
    updateSelectionFrame(dragHandle ? 'move' : 'none');
  }

  const handleKeyDown = (e: paper.KeyEvent): void => {
    setKeyDownEvent(e);
  }

  const handleKeyUp = (e: paper.KeyEvent): void => {
    setKeyUpEvent(e);
  }

  // tool mousedown will fire before selected is updated...
  // so we need to determine next selection on mousedown
  const getDragLayers = (e: paper.ToolEvent): string[] => {
    const isHoverSelected = hover && selected.includes(hover);
    if (e.modifiers.shift) {
      if (isHoverSelected) {
        return selected.reduce((result, current) => {
          if (current !== hover) {
            result = [...result, current];
          }
          return result;
        }, []);
      } else {
        if (hover) {
          return [...selected, hover];
        } else {
          return selected;
        }
      }
    } else {
      if (isHoverSelected) {
        return selected;
      } else {
        if (hover) {
          return [hover];
        } else {
          return selected;
        }
      }
    }
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    setFromEvent(e);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    setToEvent(e);
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    setEndEvent(e);
  }

  useEffect(() => {
    if (fromEvent && isEnabled) {
      const dragLayers = getDragLayers(fromEvent);
      const dragPaperLayers = dragLayers.reduce((result, current) => {
        result = [...result, getPaperLayer(current).clone({ insert: false })];
        return result;
      }, []);
      const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
      setFromBounds(nextFromBounds);
      setOriginalPaperSelection(dragPaperLayers);
      setOriginalSelection(dragLayers);
      if (fromEvent.modifiers.alt) {
        duplicateLayers({layers: dragLayers});
      }
    }
  }, [fromEvent]);

  useEffect(() => {
    if (toEvent && isEnabled) {
      const x = toEvent.point.x - toEvent.downPoint.x;
      const y = toEvent.point.y - toEvent.downPoint.y;
      const nextSnapBounds = new paperMain.Rectangle(fromBounds);
      nextSnapBounds.center.x = fromBounds.center.x + x;
      nextSnapBounds.center.y = fromBounds.center.y + y;
      setSnapBounds(nextSnapBounds);
      if (!dragging) {
        setCanvasDragging({dragging: true});
      }
    }
  }, [toEvent]);

  useEffect(() => {
    if (endEvent && isEnabled) {
      if (selected.length > 0) {
        moveLayersBy({layers: selected, x: 0, y: 0});
      }
      if (dragging) {
        setCanvasDragging({dragging: false});
      }
      resetState();
    }
  }, [endEvent]);

  useEffect(() => {
    if (selected && isEnabled && originalSelection) {
      const lengthsMatch = selected.length === originalSelection.length;
      const itemsMatch = selected.every((id) => originalSelection.includes(id));
      if ((!lengthsMatch || lengthsMatch && !itemsMatch) && !duplicateSelection) {
        setDuplicateSelection(selected);
      }
      if (lengthsMatch && itemsMatch && duplicateSelection) {
        setDuplicateSelection(null);
      }
    }
  }, [selected]);

  // handle layer translation on duplicateSelection update
  // if duplicateSelection, move original selection back to original position,
  // else, move original selection to current translation
  useEffect(() => {
    if (isEnabled && originalSelection && dragging) {
      if (duplicateSelection) {
        originalSelection.forEach((id, index) => {
          const paperLayer = getPaperLayer(id);
          const copyLayer = originalPaperSelection[index];
          paperLayer.position.x = copyLayer.position.x;
          paperLayer.position.y = copyLayer.position.y;
        });
      } else {
        translateLayers();
      }
    }
  }, [duplicateSelection]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      translateLayers();
    }
  }, [toBounds]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && dragging && !duplicateSelection) {
      if (keyDownEvent.key === 'alt' && originalSelection) {
        duplicateLayers({layers: originalSelection});
      }
    }
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && dragging && duplicateSelection) {
      if (keyUpEvent.key === 'alt' && originalSelection) {
        removeDuplicatedLayers({layers: duplicateSelection, newSelection: originalSelection});
      }
    }
  }, [keyUpEvent]);

  // handle tool enable / disable
  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
        resetState();
      }
    }
  }, [isEnabled]);

  // handle initial tool setup
  useEffect(() => {
    const dragTool = new paperMain.Tool();
    dragTool.minDistance = 1;
    dragTool.onKeyDown = handleKeyDown;
    dragTool.onKeyUp = handleKeyUp;
    dragTool.onMouseDown = handleMouseDown;
    dragTool.onMouseDrag = handleMouseDrag;
    dragTool.onMouseUp = handleMouseUp;
    setTool(dragTool);
    paperMain.tool = null;
  }, []);

  return (
    isEnabled && dragging
    ? <SnapTool
        bounds={snapBounds}
        snapRule='move'
        hitTestZones={{all: true}}
        onUpdate={setToBounds}
        toolEvent={toEvent}
        blackListLayers={selected} />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  hover: string;
  selected: string[];
  isEnabled: boolean;
  dragging: boolean;
  dragHandle: boolean;
} => {
  const { layer, canvasSettings } = state;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Drag';
  const dragging = canvasSettings.dragging;
  const dragHandle = canvasSettings.dragHandle;
  return {
    hover,
    selected,
    isEnabled,
    dragging,
    dragHandle
  };
};

export default connect(
  mapStateToProps,
  { moveLayersBy, duplicateLayers, removeDuplicatedLayers, setCanvasDragging }
)(DragTool);