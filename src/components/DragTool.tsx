/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerPaperScope, getPaperLayer, getPaperLayersBounds, getSelectedPaperScopes } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';
import { THEME_PRIMARY_COLOR } from '../constants';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayers, duplicateLayers, updateSelectionFrame } from '../store/actions/layer';
import { LayerTypes, MoveLayersPayload, DuplicateLayersPayload } from '../store/actionTypes/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface DragToolStateProps {
  hover?: string;
  selected?: string[];
  isEnabled?: boolean;
  dragging?: boolean;
  dragHandle?: boolean;
  selectedPaperScopes?: {
    [id: string]: number;
  };
  hoverPaperScope?: number;
}

interface DragToolDispatchProps {
  setCanvasDragging?(payload: SetCanvasDraggingPayload): CanvasSettingsTypes;
  moveLayers?(payload: MoveLayersPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
}

type DragToolProps = (
  DragToolStateProps &
  DragToolDispatchProps &
  PaperToolProps
);

const DragTool = (props: DragToolProps): ReactElement => {
  const { isEnabled, hover, dragHandle, setCanvasDragging, dragging, selected, moveLayers, duplicateLayers, tool, altModifier, downEvent, dragEvent, upEvent, selectedPaperScopes, hoverPaperScope } = props;
  const [originalSelection, setOriginalSelection] = useState<{id: string; paperScope: number}[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [minDistance, setMinDistance] = useState<number>(0);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [selectionOutlines, setSelectionOutlines] = useState<paper.Group>(null);

  const resetState = (): void => {
    const drawingPreview = uiPaperScope.projects[0].getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    setOriginalSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    setMinDistance(0);
    setOriginalPaperSelection(null);
    setSelectionOutlines(null);
  }

  const updateDuplicatePreview = () => {
    const drawingPreview = uiPaperScope.projects[0].getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    if (altModifier && selectionOutlines) {
      const newPreview = selectionOutlines.clone({insert: false});
      newPreview.position = toBounds.center;
      drawingPreview.addChild(newPreview);
    }
  }

  const translateLayers = (): void => {
    const vector = toBounds.center.subtract(fromBounds.center);
    if (altModifier) {
      updateDuplicatePreview();
    } else {
      selected.forEach((id, index) => {
        const paperLayer = getPaperLayer(id, selectedPaperScopes[id]);
        const ogLayer = originalPaperSelection[index];
        if (paperLayer && ogLayer) {
          const absPosition = ogLayer.position;
          paperLayer.position.x = absPosition.x + vector.x;
          paperLayer.position.y = absPosition.y + vector.y;
        }
      });
      updateSelectionFrame(toBounds, dragHandle ? 'move' : 'none');
    }
  }

  // tool mousedown will fire before selected is updated...
  // so we need to determine next selection on mousedown
  const getDragLayers = (e: paper.ToolEvent): {id: string; paperScope: number}[] => {
    const isHoverSelected = hover && selected.includes(hover);
    const selectedWithPaperScopes = selected.reduce((result, current) => {
      result = [...result, {id: current, paperScope: selectedPaperScopes[current]}];
      return result;
    }, []) as {id: string; paperScope: number}[];
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
          return [...selectedWithPaperScopes, {id: hover, paperScope: hoverPaperScope}];
        } else {
          return selectedWithPaperScopes;
        }
      }
    } else {
      if (isHoverSelected) {
        return selectedWithPaperScopes;
      } else {
        if (hover) {
          return [{id: hover, paperScope: hoverPaperScope}];
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
    if (isEnabled && originalSelection && dragging && toBounds) {
      updateDuplicatePreview();
      if (altModifier) {
        const selectionFrame = uiPaperScope.project.getItem({ data: { id: 'selectionFrame' } });
        selectionFrame.removeChildren();
        originalSelection.forEach((item, index) => {
          const paperLayer = getPaperLayer(item.id, item.paperScope);
          const ogLayer = originalPaperSelection[index];
          if (paperLayer && ogLayer) {
            const absPosition = ogLayer.position;
            paperLayer.position.x = absPosition.x;
            paperLayer.position.y = absPosition.y;
          }
        });
      } else {
        translateLayers();
      }
    }
  }, [altModifier]);

  useEffect(() => {
    if (downEvent && isEnabled) {
      if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
        uiPaperScope.projects[0].activate();
      }
      const dragLayers = getDragLayers(downEvent);
      const dragOutlines = new uiPaperScope.Group({insert: false});
      const dragPaperLayers: paper.Item[] = [];
      dragLayers.forEach((layer, index) => {
        const paperLayer = getPaperLayer(layer.id, layer.paperScope);
        dragPaperLayers.push(paperLayer.clone({ insert: false }));
        switch(paperLayer.data.layerType) {
          case 'Artboard': {
            const artboardBackground = paperLayer.getItem({ data: { id: 'artboardBackground' } });
            new uiPaperScope.Path.Rectangle({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / uiPaperScope.view.zoom,
              rectangle: artboardBackground.bounds,
              parent: dragOutlines
            });
            break;
          }
          case 'Shape':
            new uiPaperScope.CompoundPath({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / uiPaperScope.view.zoom,
              closed: paperLayer.data.shapeType !== 'Line',
              pathData: (paperLayer as paper.Path | paper.CompoundPath).pathData,
              parent: dragOutlines
            });
            break;
          case 'Text': {
            const textLayer = paperLayer.getItem({data: { id: 'textContent' }});
            const initialPoint = (textLayer as paper.PointText).point;
            (textLayer as any)._lines.forEach((line: any, index: number) => {
              new uiPaperScope.Path.Line({
                from: new uiPaperScope.Point(initialPoint.x, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
                to: new uiPaperScope.Point(initialPoint.x + textLayer.bounds.width, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
                strokeColor: THEME_PRIMARY_COLOR,
                strokeWidth: 2 / uiPaperScope.view.zoom,
                data: {
                  type: 'UIElementChild',
                  interactive: false,
                  interactiveType: null,
                  elementId: 'hoverFrame'
                },
                parent: dragOutlines
              });
            });
            break;
          }
          default:
            new uiPaperScope.Path.Rectangle({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / uiPaperScope.view.zoom,
              from: paperLayer.bounds.topLeft,
              to: paperLayer.bounds.bottomRight,
              parent: dragOutlines
            });
            break;
        }
      });
      const nextFromBounds = getPaperLayersBounds(dragPaperLayers);
      setFromBounds(nextFromBounds);
      setOriginalSelection(dragLayers);
      setOriginalPaperSelection(dragPaperLayers);
      setSelectionOutlines(dragOutlines);
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled && fromBounds) {
      if (minDistance > 3) {
        const vector = dragEvent.point.subtract(dragEvent.downPoint);
        const nextSnapBounds = new uiPaperScope.Rectangle(fromBounds);
        nextSnapBounds.center.x = fromBounds.center.x + vector.x;
        nextSnapBounds.center.y = fromBounds.center.y + vector.y;
        setSnapBounds(nextSnapBounds);
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
      if (selected.length > 0 && minDistance > 3) {
        if (altModifier) {
          const offset = toBounds.center.subtract(fromBounds.center).round();
          duplicateLayers({layers: selected, offset: {x: offset.x, y: offset.y}});
        } else {
          moveLayers({layers: selected});
        }
      }
      setCanvasDragging({dragging: false});
      resetState();
    }
  }, [upEvent]);

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
      if (tool && uiPaperScope.tool && (uiPaperScope.tool as any)._index === (tool as any)._index) {
        uiPaperScope.tool = null;
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
        blackListLayers={altModifier ? null : selected}
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
  const selectedPaperScopes = getSelectedPaperScopes(state);
  const hoverPaperScope = hover ? getLayerPaperScope(layer.present, hover) : null;
  return {
    hover,
    selected,
    isEnabled,
    dragging,
    dragHandle,
    selectedPaperScopes,
    hoverPaperScope
  };
};

const mapDispatchToProps = {
  moveLayers,
  duplicateLayers,
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