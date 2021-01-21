/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerProjectIndex, getPaperLayer, getPaperLayersBounds, getSelectedById, getSelectedProjectIndices } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { THEME_PRIMARY_COLOR } from '../constants';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { moveLayersBy, duplicateLayers, updateSelectionFrame } from '../store/actions/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const DragTool = (props: PaperToolProps): ReactElement => {
  const { tool, downEvent, dragEvent, upEvent, keyDownEvent, keyUpEvent } = props;
  const blacklistedLayers = useSelector((state: RootState) => state.layer.present.selected.some(id => state.layer.present.allArtboardIds.includes(id)) ? state.layer.present.selected : [...state.layer.present.allArtboardIds.filter(id => id !== state.layer.present.activeArtboard), ...state.layer.present.selected]);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const layerItems = useSelector((state: RootState) => {
    const selectedById = getSelectedById(state);
    const hover = state.layer.present.hover ? { [state.layer.present.hover]: state.layer.present.byId[state.layer.present.hover] } : {};
    return { ...selectedById, ...hover };
  });
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Drag');
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const dragHandle = useSelector((state: RootState) => state.canvasSettings.dragHandle);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const hoverPaperScope = useSelector((state: RootState) => hover ? getLayerProjectIndex(state.layer.present, state.layer.present.hover) : null);
  const [originalSelection, setOriginalSelection] = useState<{id: string; projectIndex: number}[]>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [minDistance, setMinDistance] = useState<number>(0);
  const [originalPaperSelection, setOriginalPaperSelection] = useState<paper.Item[]>(null);
  const [selectionOutlines, setSelectionOutlines] = useState<paper.Group>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    setOriginalSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    setMinDistance(0);
    setOriginalPaperSelection(null);
    setSelectionOutlines(null);
  }

  const updateDuplicatePreview = (altModifier: boolean): void => {
    const drawingPreview = paperMain.projects[0].getItem({data: {id: 'drawingPreview'}});
    drawingPreview.removeChildren();
    if (altModifier && selectionOutlines) {
      const newPreview = selectionOutlines.clone({insert: false});
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
      updateSelectionFrame(toBounds, dragHandle ? 'move' : 'none');
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
    if (keyDownEvent && isEnabled && originalSelection && dragging && toBounds) {
      if (keyDownEvent.key === 'alt') {
        updateDuplicatePreview(true);
        const selectionFrame = paperMain.project.getItem({ data: { id: 'selectionFrame' } });
        selectionFrame.removeChildren();
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
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && originalSelection && dragging && toBounds) {
      if (keyUpEvent.key === 'alt') {
        updateDuplicatePreview(false);
        translateLayers(false);
      }
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (downEvent && isEnabled) {
      if (paperMain.project.activeLayer.data.id !== 'ui') {
        paperMain.projects[0].activate();
      }
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
              strokeWidth: 2 / paperMain.view.zoom,
              rectangle: artboardBackground.bounds,
              parent: dragOutlines
            });
            break;
          }
          case 'Shape':
            new paperMain.CompoundPath({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / paperMain.view.zoom,
              closed: paperLayer.data.shapeType !== 'Line',
              pathData: (paperLayer as paper.Path | paper.CompoundPath).pathData,
              parent: dragOutlines
            });
            break;
          case 'Text': {
            const clone = paperLayer.clone({insert: false});
            clone.rotation = -layerItems[paperLayer.data.id].transform.rotation;
            const textLines = clone.getItems({data: {id: 'textLine'}}) as paper.PointText[];
            const textBackgroundClone = clone.getItem({data: {id: 'textBackground'}});
            const linesGroup = new paperMain.Group({
              parent: dragOutlines,
              children: [textBackgroundClone]
            });
            textLines.forEach((line, index: number) => {
              line.leading = line.fontSize;
              line.skew(new paperMain.Point((layerItems[paperLayer.data.id] as Btwx.Text).textStyle.oblique, 0));
              new paperMain.Path.Line({
                from: (() => {
                  switch(line.justification) {
                    case 'left':
                      return line.point;
                    case 'center':
                      return new paperMain.Point(line.point.x - line.bounds.width / 2, line.point.y);
                    case 'right':
                      return new paperMain.Point(line.point.x - line.bounds.width, line.point.y);
                  }
                })(),
                to: (() => {
                  switch(line.justification) {
                    case 'left':
                      return new paperMain.Point(line.point.x + line.bounds.width, line.point.y);
                    case 'center':
                      return new paperMain.Point(line.point.x + line.bounds.width / 2, line.point.y);
                    case 'right':
                      return line.point;
                  }
                })(),
                strokeColor: THEME_PRIMARY_COLOR,
                strokeWidth: 2 / paperMain.view.zoom,
                parent: linesGroup
              });
            });
            linesGroup.rotation = layerItems[paperLayer.data.id].transform.rotation;
            break;
          }
          default:
            new paperMain.Path.Rectangle({
              strokeColor: THEME_PRIMARY_COLOR,
              strokeWidth: 2 / paperMain.view.zoom,
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
        const nextSnapBounds = new paperMain.Rectangle(fromBounds);
        nextSnapBounds.center.x = fromBounds.center.x + vector.x;
        nextSnapBounds.center.y = fromBounds.center.y + vector.y;
        setSnapBounds(nextSnapBounds);
      } else {
        if (!dragging) {
          dispatch(setCanvasDragging({dragging: true}));
        }
        setMinDistance(minDistance + 1);
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      if (selected.length > 0 && minDistance > 3) {
        const offset = toBounds.center.subtract(fromBounds.center).round();
        if (upEvent.modifiers.alt) {
          dispatch(duplicateLayers({layers: selected, offset: {x: offset.x, y: offset.y}}));
        } else {
          dispatch(moveLayersBy({layers: selected, x: offset.x, y: offset.y}));
        }
      }
      dispatch(setCanvasDragging({dragging: false}));
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