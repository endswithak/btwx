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
  const [from, setFrom] = useState<paper.Point>(null);
  const [to, setTo] = useState<paper.Point>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [toolEvent, setToolEvent] = useState(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [altModifier, setAltModifier] = useState<boolean>(false);

  const resetState = (): void => {
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setFrom(null);
    setTo(null);
    setFromBounds(null);
    setToBounds(null);
    setToolEvent(null);
    setSnapBounds(null);
    setOriginalPaperSelection(null);
    setAltModifier(false);
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
    switch(e.key) {
      case 'alt':
        setAltModifier(true);
        if (originalSelection && !duplicateSelection) {
          duplicateLayers({layers: originalSelection});
        }
        break;
    }
  }

  const handleKeyUp = (e: paper.KeyEvent): void => {
    switch(e.key) {
      case 'alt':
        setAltModifier(false);
        if (originalSelection && duplicateSelection) {
          removeDuplicatedLayers({layers: duplicateSelection, newSelection: originalSelection});
        }
        break;
    }
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
    const dragLayers = getDragLayers(e);
    const dragPaperLayers = dragLayers.reduce((result, current) => {
      result = [...result, getPaperLayer(current).clone({ insert: false })];
      return result;
    }, []);
    const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
    setFrom(e.point);
    setFromBounds(nextFromBounds);
    setOriginalPaperSelection(dragPaperLayers);
    setOriginalSelection(dragLayers);
    if (altModifier) {
      duplicateLayers({layers: dragLayers});
      setCanvasDragging({dragging: true});
    }
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    if (from && originalSelection && selected.length > 0) {
      setToolEvent(e);
      setTo(e.point);
      if (!dragging) {
        setCanvasDragging({dragging: true});
      }
    }
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    if (selected.length > 0) {
      moveLayersBy({layers: selected, x: 0, y: 0});
    }
    if (dragging) {
      setCanvasDragging({dragging: false});
    }
    resetState();
  }

  useEffect(() => {
    if (tool && !dragging) {
      tool.onKeyDown = handleKeyDown;
      tool.onKeyUp = handleKeyUp;
      tool.onMouseDown = handleMouseDown;
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [snapBounds, selected, fromBounds, originalSelection, hover, dragging, isEnabled, dragHandle, duplicateSelection, altModifier]);

  useEffect(() => {
    if (tool) {
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [dragging]);

  useEffect(() => {
    if (tool) {
      tool.onKeyDown = handleKeyDown;
      tool.onKeyUp = handleKeyUp;
    }
  }, [duplicateSelection, altModifier, originalSelection]);

  // update snap bounds
  useEffect(() => {
    if (to && tool && isEnabled && dragging) {
      const x = to.x - from.x;
      const y = to.y - from.y;
      const nextSnapBounds = new paperMain.Rectangle(fromBounds);
      nextSnapBounds.center.x = fromBounds.center.x + x;
      nextSnapBounds.center.y = fromBounds.center.y + y;
      setSnapBounds(nextSnapBounds);
    }
  }, [to]);

  // handle duplicateSelection...
  // duplicateLayers & removeDuplicatedLayers actions update selected
  useEffect(() => {
    if (tool && isEnabled) {
      if (altModifier) {
        if (originalSelection && !duplicateSelection) {
          setDuplicateSelection(selected);
        }
      } else {
        if (originalSelection && duplicateSelection) {
          setDuplicateSelection(null);
        }
      }
    }
  }, [selected]);

  // handle layer translation on duplicateSelection update
  // if duplicateSelection, move original selection back to original position,
  // else, move original selection to current translation
  useEffect(() => {
    if (tool && isEnabled && dragging) {
      if (duplicateSelection) {
        originalSelection.forEach((id, index) => {
          const paperLayer = getPaperLayer(id);
          const copyLayer = originalPaperSelection[index];
          paperLayer.position.x = copyLayer.position.x;
          paperLayer.position.y = copyLayer.position.y;
        });
      } else {
        if (originalSelection) {
          translateLayers();
        }
      }
    }
  }, [duplicateSelection]);

  // handle layer translation on toBounds update
  useEffect(() => {
    if (tool && isEnabled && dragging) {
      if (originalSelection || duplicateSelection) {
        translateLayers();
      }
    }
  }, [toBounds]);

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
        toolEvent={toolEvent}
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