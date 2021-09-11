/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayersBounds, getLayerDescendants } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { paperRectToRawRect, getShapeItemPathItem, getShapeItemMaskPathItem, getTopCompoundShape, getCompoundShapeBoolPath } from '../utils';
import { setCanvasDragging } from '../store/actions/canvasSettings';
import { moveLayersBy, duplicateLayers } from '../store/actions/layer';
import { setSelectionToolBounds } from '../store/actions/selectionTool';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const DragTool = (props: PaperToolProps): ReactElement => {
  const { tool, downEvent, dragEvent, upEvent, keyDownEvent, keyUpEvent } = props;
  const blacklistedLayers = useSelector((state: RootState) => state.layer.present.selected.some(id => state.layer.present.allArtboardIds.includes(id)) ? state.layer.present.selected : [...state.layer.present.allArtboardIds.filter(id => id !== state.layer.present.activeArtboard), ...state.layer.present.selected]);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const layersById = useSelector((state: RootState) => state.layer.present.byId);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Drag');
  const dragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const [allIds, setAllIds] = useState(null);
  const [byId, setById] = useState(null);
  const [paperLayerById, setPaperLayerById] = useState(null);
  const [positionById, setPositionById] = useState(null);
  const [descendentsById, setDescendentsById] = useState(null);
  const [symbolGroup, setSymbolGroup] = useState(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const dispatch = useDispatch();

  const resetState = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' } });
    drawingPreview.removeChildren();
    setAllIds(null);
    setById(null);
    setPaperLayerById(null);
    setPositionById(null);
    setDescendentsById(null);
    setSymbolGroup(null);
    setFromBounds(null);
    setToBounds(null);
    setSnapBounds(null);
    if (dragging) {
      dispatch(setCanvasDragging({dragging: false}));
    }
  }

  const renderDuplicatePreview = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' } });
    drawingPreview.removeChildren();
    if (symbolGroup) {
      const newPreview = symbolGroup.place();
      newPreview.position = toBounds.center;
      drawingPreview.addChild(newPreview);
    }
  }

  const clearDuplicatePreview = (): void => {
    const drawingPreview = paperMain.projects[0].getItem({ data: { id: 'drawingPreview' } });
    drawingPreview.removeChildren();
  }

  const translateShapeItem = ({
    id,
    includeOffset,
    vector,
    updateBool = true
  }) => {
    const layerItem = byId[id];
    const parentItem = layersById[layerItem.parent];
    const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
    const paperLayer = paperLayerById[id];
    const originalPosition = positionById[id];
    const compoundShapeParent = parentItem.type === 'CompoundShape';
    const topCompoundShape = compoundShapeParent ? getTopCompoundShape(id, layersById) : null;
    const topCompoundShapePaperLayer = compoundShapeParent ? paperMain.projects[artboardItem.projectIndex].getItem({data: {id: topCompoundShape}}) : null;
    const pathItem = getShapeItemPathItem(paperLayer as paper.Group);
    pathItem.position.x = originalPosition[0] + (includeOffset ? vector.x : 0);
    pathItem.position.y = originalPosition[1] + (includeOffset ? vector.y : 0);
    if (layerItem.mask) {
      const maskPathItem = getShapeItemMaskPathItem(paperLayer as paper.Group);
      maskPathItem.position.x = originalPosition[0] + (includeOffset ? vector.x : 0);
      maskPathItem.position.y = originalPosition[1] + (includeOffset ? vector.y : 0);
    }
    if (compoundShapeParent && updateBool) {
      const compoundShapeParentPathItem = getShapeItemPathItem(topCompoundShapePaperLayer as paper.Group);
      const boolResult = getCompoundShapeBoolPath({
        id: topCompoundShape,
        layersById,
        useExistingPaths: true
      });
      const data = compoundShapeParentPathItem.data;
      const style = compoundShapeParentPathItem.style;
      boolResult.data = data;
      boolResult.style = style;
      compoundShapeParentPathItem.replaceWith(boolResult);
    }
  }

  const translateLayers = ({
    includeOffset = true
  } : {
    includeOffset?: boolean
  }): void => {
    const vector = toBounds.center.subtract(fromBounds.center);
    allIds.forEach((id) => {
      const layerItem = byId[id];
      const paperLayer = paperLayerById[id];
      const originalPosition = positionById[id];
      switch(layerItem.type) {
        case 'Shape': {
          translateShapeItem({id, includeOffset, vector});
          break;
        }
        case 'CompoundShape': {
          [id, ...descendentsById[id]].forEach((did, index) => {
            translateShapeItem({
              id: did,
              includeOffset,
              vector,
              updateBool: index === [id, ...descendentsById[id]].length - 1
            });
          });
          break;
        }
        default: {
          paperLayer.position.x = originalPosition[0] + (includeOffset ? vector.x : 0);
          paperLayer.position.y = originalPosition[1] + (includeOffset ? vector.y : 0);
        }
      }
    });
    dispatch(setSelectionToolBounds({
      bounds: paperRectToRawRect(toBounds)
    }));
  }

  // tool mousedown will fire before selected is updated...
  // so we need to determine next selection on mousedown
  const getDragLayers = (e: paper.ToolEvent): {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Layer;
    };
    paperLayerById: {
      [id: string]: paper.Item;
    };
    positionById: {
      [id: string]: number[];
    };
    descendntsById: {
      [id: string]: string[];
    };
  } => {
    let allIds = [...selected, ...(hover && !selected.includes(hover) ? [hover] : [])];
    if (e.modifiers.shift) {
      if (hover && selected.includes(hover)) {
        allIds = [...selected];
      }
    } else {
      if (hover && !selected.includes(hover)) {
        allIds = [hover];
      }
    }
    return allIds.reduce((result, current) =>  {
      const layerItem = layersById[current] as Btwx.Layer;
      const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id: current}});
      if (layerItem.type === 'CompoundShape') {
        const descendents = getLayerDescendants({byId: layersById}, current);
        result = {
          ...result,
          descendntsById: {
            ...result.descendntsById,
            [current]: descendents
          }
        }
        result = descendents.reduce((r, c) => {
          const li = layersById[c] as Btwx.Layer;
          const pl = paperMain.projects[artboardItem.projectIndex].getItem({data: {id: c}});
          r = {
            ...r,
            byId: {
              ...r.byId,
              [c]: li
            },
            paperLayerById: {
              ...r.paperLayerById,
              [c]: pl
            },
            positionById: {
              ...r.positionById,
              [c]: [pl.position.x, pl.position.y]
            }
          }
          return r;
        }, result);
      }
      return {
        ...result,
        byId: {
          ...result.byId,
          [current]: layerItem
        },
        paperLayerById: {
          ...result.paperLayerById,
          [current]: paperLayer
        },
        positionById: {
          ...result.positionById,
          [current]: [paperLayer.position.x, paperLayer.position.y]
        }
      }
    }, { allIds: allIds, byId: {}, paperLayerById: {}, positionById: {}, descendntsById: {} } as {
      allIds: string[];
      byId: {
        [id: string]: Btwx.Layer;
      };
      paperLayerById: {
        [id: string]: paper.Item;
      };
      positionById: {
        [id: string]: number[];
      };
      descendntsById: {
        [id: string]: string[];
      };
    });
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && allIds && dragging && toBounds) {
        if (keyDownEvent.key === 'alt') {
          renderDuplicatePreview();
          translateLayers({
            includeOffset: false
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
      if (keyUpEvent && isEnabled && allIds && dragging && toBounds) {
        if (keyUpEvent.key === 'alt') {
          clearDuplicatePreview();
          translateLayers({
            includeOffset: true
          });
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
        const symbolGroupDefinition = new paperMain.SymbolDefinition(new paperMain.Group({
          insert: false,
          children: dragLayers.allIds.map((id) => dragLayers.paperLayerById[id].clone({insert: false}))
        }), true);
        const nextFromBounds = getPaperLayersBounds(
          dragLayers.allIds.map((id) => dragLayers.paperLayerById[id])
        );
        setPaperLayerById(dragLayers.paperLayerById);
        setById(dragLayers.byId);
        setAllIds(dragLayers.allIds);
        setDescendentsById(dragLayers.descendntsById);
        setPositionById(dragLayers.positionById);
        setSymbolGroup(symbolGroupDefinition);
        setFromBounds(nextFromBounds);
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
      if (dragEvent.modifiers.alt) {
        renderDuplicatePreview();
      } else {
        translateLayers({
          includeOffset: true
        });
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