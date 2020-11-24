/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState, useCallback } from 'react';
import throttle from 'lodash.throttle';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerProjectIndex, getPaperLayer, getPaperLayersBounds, getSelectedProjectIndex } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { THEME_PRIMARY_COLOR } from '../constants';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasDraggingPayload } from '../store/actionTypes/canvasSettings';
import { moveLayers, duplicateLayers, updateSelectionFrame } from '../store/actions/layer';
import { LayerTypes, MoveLayersPayload, DuplicateLayersPayload, RemoveDuplicatedLayersPayload } from '../store/actionTypes/layer';
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
  duplicateLayers?(payload: DuplicateLayersPayload): Promise<string[]>;
  removeDuplicatedLayersThunk?(payload: RemoveDuplicatedLayersPayload): Promise<string[]>;
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
  }

  const updateDuplicatePreview = (am: boolean, so: paper.Group, tb: paper.Rectangle) => {
    const ui = paperMain.projects[1];
    const drawingPreview = ui.getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    if (am) {
      const newPreview = so.clone({insert: false});
      newPreview.position = tb.center;
      drawingPreview.addChild(newPreview);
    }
  }

  const throttleDrag = useCallback(
    throttle((tb: paper.Rectangle, fb: paper.Rectangle, selected: string[], ops: paper.Item[], dh: boolean, am: boolean, so: paper.Group) => {
      const translate = {
        x: tb.center.x - fb.center.x,
        y: tb.center.y - fb.center.y
      };
      if (am) {
        updateDuplicatePreview(am, so, tb);
      } else {
        selected.forEach((id, index) => {
          const paperLayer = getPaperLayer(id, selectedProjectIndex[id]);
          const ogLayer = ops[index];
          if (paperLayer && ogLayer) {
            const absPosition = ogLayer.position;
            paperLayer.position.x = absPosition.x + translate.x;
            paperLayer.position.y = absPosition.y + translate.y;
          }
        });
        updateSelectionFrame(dh ? 'move' : 'none');
      }
    }, 25),
    []
  );

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
    if (isEnabled && originalSelection && dragging) {
      if (altModifier) {
        updateDuplicatePreview(altModifier, selectionOutlines, toBounds);
        originalSelection.forEach((item, index) => {
          const paperLayer = getPaperLayer(item.id, item.projectIndex);
          const ogLayer = originalPaperSelection[index];
          if (paperLayer && ogLayer) {
            const absPosition = ogLayer.position;
            paperLayer.position.x = absPosition.x;
            paperLayer.position.y = absPosition.y;
          }
        });
        updateSelectionFrame(dragHandle ? 'move' : 'none');
      } else {
        updateDuplicatePreview(altModifier, selectionOutlines, toBounds);
        throttleDrag(toBounds, fromBounds, selected, originalPaperSelection, dragHandle, altModifier, selectionOutlines);
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
        const x = dragEvent.point.x - dragEvent.downPoint.x;
        const y = dragEvent.point.y - dragEvent.downPoint.y;
        const nextSnapBounds = new paperMain.Rectangle(fromBounds);
        nextSnapBounds.center.x = fromBounds.center.x + x;
        nextSnapBounds.center.y = fromBounds.center.y + y;
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
          const offset = upEvent.point.subtract(upEvent.downPoint);
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
      throttleDrag(toBounds, fromBounds, selected, originalPaperSelection, dragHandle, altModifier, selectionOutlines);
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