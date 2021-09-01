/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerProjectIndex, getPaperLayer, getPaperLayersBounds, getSelectedProjectIndices, getSingleLineSelected } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { paperRectToRawRect } from '../utils';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { moveLayersBy, duplicateLayers } from '../store/actions/layer';
import { setSelectionToolBounds } from '../store/actions/selectionTool';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';
import { clearSelectionFrame } from './SelectionFrame';

const DragTool = (props: PaperToolProps): ReactElement => {
  const { tool, downEvent, dragEvent, upEvent, keyDownEvent, keyUpEvent } = props;
  const blacklistedLayers = useSelector((state: RootState) => state.layer.present.selected.some(id => state.layer.present.allArtboardIds.includes(id)) ? state.layer.present.selected : [...state.layer.present.allArtboardIds.filter(id => id !== state.layer.present.activeArtboard), ...state.layer.present.selected]);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Drag');
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const hoverPaperScope = useSelector((state: RootState) => hover ? getLayerProjectIndex(state.layer.present, state.layer.present.hover) : null);
  const [originalSelection, setOriginalSelection] = useState<{id: string; projectIndex: number}[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [selectionOutlines, setSelectionOutlines] = useState<paper.SymbolDefinition>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' } });
    drawingPreview.removeChildren();
    setOriginalSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    setOriginalPaperSelection(null);
    setSelectionOutlines(null);
    if (dragging) {
      dispatch(setCanvasDragging({dragging: false}));
    }
  }

  const updateDuplicatePreview = (altModifier: boolean): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' } });
    drawingPreview.removeChildren();
    if (altModifier && selectionOutlines) {
      const newPreview = selectionOutlines.place();
      newPreview.position = toBounds.center;
      drawingPreview.addChild(newPreview);
    }
  }

  const translateLayers = (altModifier: boolean): void => {
    const vector = toBounds.center.subtract(fromBounds.center);
    if (altModifier) {
      updateDuplicatePreview(altModifier);
    } else {
      selected.forEach((id, index) => {
        const paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
        const ogLayer = originalPaperSelection[index];
        if (paperLayer && ogLayer) {
          const absPosition = ogLayer.position;
          paperLayer.position.x = absPosition.x + vector.x;
          paperLayer.position.y = absPosition.y + vector.y;
          if (paperLayer.data.layerType === 'Shape' && paperLayer.parent.data.id === 'maskGroup' && paperLayer.index === 1) {
            paperLayer.parent.children[0].position = paperLayer.position;
          }
        }
      });
      dispatch(setSelectionToolBounds({
        bounds: paperRectToRawRect(toBounds)
      }));
    }
  }

  // tool mousedown will fire before selected is updated...
  // so we need to determine next selection on mousedown
  const getDragLayers = (e: paper.ToolEvent): {id: string; projectIndex: number}[] => {
    const isHoverSelected = hover && selected.includes(hover);
    const selectedWithPaperScopes = selected.reduce((result, current) => {
      result = [...result, {id: current, projectIndex: selectedProjectIndices[current]}];
      return result;
    }, []) as {id: string; projectIndex: number}[];
    if (e.modifiers.shift) {
      if (isHoverSelected) {
        return selectedWithPaperScopes.reduce((result, current) => {
          if (current.id !== hover) {
            result = [...result, current];
          }
          return result;
        }, []);
      } else {
        if (hover) {
          return [...selectedWithPaperScopes, {id: hover, projectIndex: hoverPaperScope}];
        } else {
          return selectedWithPaperScopes;
        }
      }
    } else {
      if (isHoverSelected) {
        return selectedWithPaperScopes;
      } else {
        if (hover) {
          return [{id: hover, projectIndex: hoverPaperScope}];
        } else {
          return selectedWithPaperScopes;
        }
      }
    }
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && originalSelection && dragging && toBounds) {
        if (keyDownEvent.key === 'alt') {
          updateDuplicatePreview(true);
          clearSelectionFrame();
          originalSelection.forEach((item, index) => {
            const paperLayer = getPaperLayer(item.id, item.projectIndex);
            const ogLayer = originalPaperSelection[index];
            if (paperLayer && ogLayer) {
              const absPosition = ogLayer.position;
              paperLayer.position.x = absPosition.x;
              paperLayer.position.y = absPosition.y;
              if (paperLayer.data.layerType === 'Shape' && paperLayer.parent.data.id === 'maskGroup' && paperLayer.index === 1) {
                paperLayer.parent.children[0].position = paperLayer.position;
              }
            }
          });
        }
      }
    } catch(err) {
      console.error(`Drag Tool Error -- On Key Down -- ${err}`);
      resetState();
    }
  }, [keyDownEvent]);

  useEffect(() => {
    try {
      if (keyUpEvent && isEnabled && originalSelection && dragging && toBounds) {
        if (keyUpEvent.key === 'alt') {
          updateDuplicatePreview(false);
          translateLayers(false);
        }
      }
    } catch(err) {
      console.error(`Drag Tool Error -- On Key Up -- ${err}`);
      resetState();
    }
  }, [keyUpEvent]);

  useEffect(() => {
    try {
      if (downEvent && isEnabled) {
        if (paperMain.project.activeLayer.data.id !== 'ui') {
          paperMain.projects[0].activate();
        }
        const dragLayers = getDragLayers(downEvent);
        const dragOutlines = new paperMain.Group({ insert: false });
        const dragPaperLayers: paper.Item[] = [];
        dragLayers.forEach((layer) => {
          const paperLayer = getPaperLayer(layer.id, layer.projectIndex);
          dragPaperLayers.push(paperLayer.clone({ insert: false }));
          dragOutlines.addChild(paperLayer.clone({ insert: false }));
        });
        const outlinesSymbol = new paperMain.SymbolDefinition(dragOutlines, true);
        const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
        setFromBounds(nextFromBounds);
        setOriginalSelection(dragLayers);
        setOriginalPaperSelection(dragPaperLayers);
        setSelectionOutlines(outlinesSymbol);
      }
    } catch(err) {
      console.error(`Drag Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent]);

  useEffect(() => {
    try {
      if (dragEvent && isEnabled && fromBounds) {
        const vector = dragEvent.point.subtract(dragEvent.downPoint);
        const nextSnapBounds = new paperMain.Rectangle(fromBounds);
        nextSnapBounds.center.x = fromBounds.center.x + vector.x;
        nextSnapBounds.center.y = fromBounds.center.y + vector.y;
        setSnapBounds(nextSnapBounds);
        if (!dragging) {
          dispatch(setCanvasDragging({dragging: true}));
        }
      }
    } catch(err) {
      console.error(`Drag Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (upEvent && isEnabled && fromBounds && toBounds && selected.length > 0) {
        const offset = toBounds.center.subtract(fromBounds.center).round();
        if (upEvent.modifiers.alt) {
          dispatch(duplicateLayers({
            layers: selected,
            offset: {
              x: offset.x,
              y: offset.y
            }
          }));
        } else {
          dispatch(moveLayersBy({
            layers: selected,
            x: offset.x,
            y: offset.y
          }));
        }
      }
      resetState();
    } catch(err) {
      console.error(`Drag Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    if (toBounds && isEnabled && dragEvent) {
      translateLayers(dragEvent.modifiers.alt);
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
        blackListLayers={dragEvent.modifiers.alt ? null : blacklistedLayers}
        measure />
    : null
  );
}

export default PaperTool(
  DragTool,
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true,
    keyDown: true,
    keyUp: true
  }
);