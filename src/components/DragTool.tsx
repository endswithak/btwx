/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState, useCallback } from 'react';
import throttle from 'lodash.throttle';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayer, getPaperLayersBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayersBy, duplicateLayersThunk, removeDuplicatedLayersThunk, updateSelectionFrame } from '../store/actions/layer';
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
  duplicateLayersThunk?(payload: DuplicateLayersPayload): Promise<string[]>;
  removeDuplicatedLayersThunk?(payload: RemoveDuplicatedLayersPayload): Promise<string[]>;
}

type DragToolProps = (
  DragToolStateProps &
  DragToolDispatchProps &
  PaperToolProps
);

const DragTool = (props: DragToolProps): ReactElement => {
  const { isEnabled, hover, dragHandle, setCanvasDragging, dragging, selected, moveLayersBy, duplicateLayersThunk, removeDuplicatedLayersThunk, tool, altModifier, downEvent, dragEvent, upEvent } = props;
  const [originalSelection, setOriginalSelection] = useState<string[]>(null);
  const [duplicateSelection, setDuplicateSelection] = useState<string[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [minDistance, setMinDistance] = useState<number>(0);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);

  const resetState = (): void => {
    setOriginalSelection(null);
    setDuplicateSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    setMinDistance(0);
    setOriginalPaperSelection(null);
  }

  const throttleDrag = useCallback(
    throttle((tb: paper.Rectangle, fb: paper.Rectangle, selected: string[], ops: paper.Item[], dh: boolean) => {
      const translate = {
        x: tb.center.x - fb.center.x,
        y: tb.center.y - fb.center.y
      };
      selected.forEach((id, index) => {
        const paperLayer = getPaperLayer(id);
        const ogLayer = ops[index];
        if (paperLayer && ogLayer) {
          const absPosition = ogLayer.position;
          paperLayer.position.x = absPosition.x + translate.x;
          paperLayer.position.y = absPosition.y + translate.y;
        }
      });
      updateSelectionFrame(dh ? 'move' : 'none');
    }, 50),
    []
  );

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
    if (isEnabled) {
      if (altModifier && dragging && !duplicateSelection) {
        duplicateLayersThunk({layers: originalSelection}).then((newSelected) => {
          setDuplicateSelection(newSelected);
        });
      }
      if (!altModifier && dragging && duplicateSelection) {
        removeDuplicatedLayersThunk({layers: duplicateSelection, newSelection: originalSelection}).then(() => {
          setDuplicateSelection(null);
        });
      }
    }
  }, [altModifier]);

  useEffect(() => {
    if (downEvent && isEnabled) {
      const dragLayers = getDragLayers(downEvent);
      const dragPaperLayers = dragLayers.reduce((result, current) => {
        result = [...result, getPaperLayer(current).clone({ insert: false })];
        return result;
      }, []);
      const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
      setFromBounds(nextFromBounds);
      setOriginalSelection(dragLayers);
      setOriginalPaperSelection(dragPaperLayers);
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled && fromBounds) {
      if (minDistance > 2) {
        const x = dragEvent.point.x - dragEvent.downPoint.x;
        const y = dragEvent.point.y - dragEvent.downPoint.y;
        const nextSnapBounds = new paperMain.Rectangle(fromBounds);
        nextSnapBounds.center.x = fromBounds.center.x + x;
        nextSnapBounds.center.y = fromBounds.center.y + y;
        setSnapBounds(nextSnapBounds);
        if (dragEvent.modifiers.alt && !duplicateSelection) {
          duplicateLayersThunk({layers: originalSelection}).then((newSelected) => {
            setDuplicateSelection(newSelected);
          });
        }
      } else {
        if (!dragging) {
          setCanvasDragging({dragging: true});
        }
        setMinDistance(minDistance + 1);
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      if (selected.length > 0 && minDistance > 2) {
        moveLayersBy({layers: selected, x: 0, y: 0});
      }
      if (dragging) {
        setCanvasDragging({dragging: false});
      }
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    if (isEnabled && originalSelection && dragging) {
      if (duplicateSelection) {
        originalSelection.forEach((id, index) => {
          const paperLayer = getPaperLayer(id);
          const ogLayer = originalPaperSelection[index];
          if (paperLayer && ogLayer) {
            const absPosition = ogLayer.position;
            paperLayer.position.x = absPosition.x;
            paperLayer.position.y = absPosition.y;
          }
        });
      } else {
        throttleDrag(toBounds, fromBounds, selected, originalPaperSelection, dragHandle);
      }
    }
  }, [duplicateSelection]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      throttleDrag(toBounds, fromBounds, selected, originalPaperSelection, dragHandle);
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
  duplicateLayersThunk,
  removeDuplicatedLayersThunk,
  setCanvasDragging
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DragTool),
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true
  }
);