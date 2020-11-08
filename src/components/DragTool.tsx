/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayer, getPaperLayersBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayers, removeDuplicatedLayers, updateSelectionFrame } from '../store/actions/layer';
import { LayerTypes, MoveLayersByPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface DragToolStateProps {
  hover?: string;
  selected?: string[];
  isEnabled?: boolean;
  dragging?: boolean;
  dragHandle?: boolean;
}

interface DragToolDispatchProps {
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
  moveLayersBy?(payload: MoveLayersByPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  removeDuplicatedLayers?(payload: RemoveDuplicatedLayersPayload): LayerTypes;
}

type DragToolProps = (
  DragToolStateProps &
  DragToolDispatchProps &
  PaperToolProps
);

const DragTool = (props: DragToolProps): ReactElement => {
  const { isEnabled, hover, dragHandle, setCanvasDragging, dragging, selected, moveLayersBy, duplicateLayers, removeDuplicatedLayers, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
  const [originalSelection, setOriginalSelection] = useState<string[]>(null);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [duplicateSelection, setDuplicateSelection] = useState<string[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);

  const resetState = (): void => {
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    setOriginalPaperSelection(null);
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

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (downEvent && isEnabled) {
      const dragLayers = getDragLayers(downEvent);
      const dragPaperLayers = dragLayers.reduce((result, current) => {
        result = [...result, getPaperLayer(current).clone({ insert: false })];
        return result;
      }, []);
      const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
      setFromBounds(nextFromBounds);
      setOriginalPaperSelection(dragPaperLayers);
      setOriginalSelection(dragLayers);
      if (downEvent.modifiers.alt) {
        duplicateLayers({layers: dragLayers});
      }
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled) {
      const x = dragEvent.point.x - dragEvent.downPoint.x;
      const y = dragEvent.point.y - dragEvent.downPoint.y;
      const nextSnapBounds = new paperMain.Rectangle(fromBounds);
      nextSnapBounds.center.x = fromBounds.center.x + x;
      nextSnapBounds.center.y = fromBounds.center.y + y;
      setSnapBounds(nextSnapBounds);
      if (!dragging) {
        setCanvasDragging({dragging: true});
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      if (selected.length > 0) {
        moveLayersBy({layers: selected, x: 0, y: 0});
      }
      if (dragging) {
        setCanvasDragging({dragging: false});
      }
      resetState();
    }
  }, [upEvent]);

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

  return (
    isEnabled && dragging
    ? <SnapTool
        bounds={snapBounds}
        snapRule='move'
        hitTestZones={{all: true}}
        onUpdate={handleSnapToolUpdate}
        toolEvent={dragEvent}
        blackListLayers={selected}
        measure />
    : null
  );
}

const mapStateToProps = (state: RootState): DragToolStateProps => {
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

const mapDispatchToProps = {
  moveLayersBy,
  duplicateLayers,
  removeDuplicatedLayers,
  setCanvasDragging
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DragTool)
);