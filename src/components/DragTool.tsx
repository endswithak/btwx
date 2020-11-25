/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerProjectIndex, getPaperLayer, getPaperLayersBounds, getSelectedProjectIndex } from '../store/selectors/layer';
import { paperMain } from '../canvas';
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
  selectedProjectIndex?: {
    [id: string]: number;
  };
  hoverProjectIndex?: number;
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
  const { isEnabled, hover, dragHandle, setCanvasDragging, dragging, selected, moveLayers, duplicateLayers, tool, altModifier, downEvent, dragEvent, upEvent, selectedProjectIndex, hoverProjectIndex } = props;
  const [originalSelection, setOriginalSelection] = useState<{id: string; projectIndex: number}[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [minDistance, setMinDistance] = useState<number>(0);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [selectionOutlines, setSelectionOutlines] = useState<paper.Group>(null);

  const resetState = (): void => {
    const ui = paperMain.projects[1];
    const drawingPreview = ui.getItem({data: {id: 'drawingPreview'}});
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
    const ui = paperMain.projects[1];
    const drawingPreview = ui.getItem({data: {id: 'drawingPreview'}});
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
        const paperLayer = getPaperLayer(id, selectedProjectIndex[id]);
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
  const getDragLayers = (e: paper.ToolEvent): {id: string; projectIndex: number}[] => {
    const isHoverSelected = hover && selected.includes(hover);
    const selectedWithProjectIndex = selected.reduce((result, current) => {
      result = [...result, {id: current, projectIndex: selectedProjectIndex[current]}];
      return result;
    }, []) as {id: string; projectIndex: number}[];
    if (e.modifiers.shift) {
      if (isHoverSelected) {
        return selectedWithProjectIndex.reduce((result, current) => {
          if (current.id !== hover) {
            result = [...result, current];
          }
          return result;
        }, []);
      } else {
        if (hover) {
          return [...selectedWithProjectIndex, {id: hover, projectIndex: hoverProjectIndex}];
        } else {
          return selectedWithProjectIndex;
        }
      }
    } else {
      if (isHoverSelected) {
        return selectedWithProjectIndex;
      } else {
        if (hover) {
          return [{id: hover, projectIndex: hoverProjectIndex}];
        } else {
          return selectedWithProjectIndex;
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
        const selectionFrame = paperMain.projects[1].getItem({ data: { id: 'selectionFrame' } });
        selectionFrame.removeChildren();
        originalSelection.forEach((item, index) => {
          const paperLayer = getPaperLayer(item.id, item.projectIndex);
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
      const dragLayers = getDragLayers(downEvent);
      const dragOutlines = new paperMain.Group({insert: false});
      const dragPaperLayers: paper.Item[] = [];
      dragLayers.forEach((layer, index) => {
        const paperLayer = getPaperLayer(layer.id, layer.projectIndex);
        dragPaperLayers.push(paperLayer.clone({ insert: false }));
        switch(paperLayer.data.layerType) {
          case 'Artboard': {
            const artboardBackground = paperLayer.getItem({ data: { id: 'artboardBackground' } });
            new paperMain.Path.Rectangle({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / paperMain.projects[0].view.zoom,
              rectangle: artboardBackground.bounds,
              parent: dragOutlines
            });
            break;
          }
          case 'Shape':
            new paperMain.CompoundPath({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / paperMain.projects[0].view.zoom,
              closed: paperLayer.data.shapeType !== 'Line',
              pathData: (paperLayer as paper.Path | paper.CompoundPath).pathData,
              parent: dragOutlines
            });
            break;
          case 'Text': {
            const textLayer = paperLayer.getItem({data: { id: 'textContent' }});
            const initialPoint = (textLayer as paper.PointText).point;
            (textLayer as any)._lines.forEach((line: any, index: number) => {
              new paperMain.Path.Line({
                from: new paperMain.Point(initialPoint.x, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
                to: new paperMain.Point(initialPoint.x + textLayer.bounds.width, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
                strokeColor: THEME_PRIMARY_COLOR,
                strokeWidth: 2 / paperMain.projects[0].view.zoom,
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
            new paperMain.Path.Rectangle({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / paperMain.projects[0].view.zoom,
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
      if (minDistance > 2) {
        const vector = dragEvent.point.subtract(dragEvent.downPoint);
        const nextSnapBounds = new paperMain.Rectangle(fromBounds);
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
      if (selected.length > 0 && minDistance > 2) {
        if (altModifier) {
          const offset = toBounds.center.subtract(fromBounds.center);
          duplicateLayers({layers: selected, offset: {x: offset.x, y: offset.y}});
        } else {
          moveLayers({layers: selected});
        }
      }
      if (dragging) {
        setCanvasDragging({dragging: false});
      }
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
  const selectedProjectIndex = getSelectedProjectIndex(state);
  const hoverProjectIndex = hover ? getLayerProjectIndex(layer.present, hover) : null;
  return {
    hover,
    selected,
    isEnabled,
    dragging,
    dragHandle,
    selectedProjectIndex,
    hoverProjectIndex
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