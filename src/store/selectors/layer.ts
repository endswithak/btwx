/* eslint-disable @typescript-eslint/no-use-before-define */
import { createSelector } from 'reselect';
import paper from 'paper';
import isSVG from 'is-svg';
import { clipboard } from 'electron';
import layer, { LayerState } from '../reducers/layer';
import { uiPaperScope } from '../../canvas';
import { bufferToBase64 } from '../../utils';
import { RootState } from '../reducers';

export const getArtboardEventDestinationIds = (state: RootState, id: string): string[] => (state.layer.present.byId[id] as Btwx.Artboard).destinationArtboardForEvents;
export const getArtboardEventOriginIds = (state: RootState, id: string): string[] => (state.layer.present.byId[id] as Btwx.Artboard).originArtboardForEvents;
export const getSelected = (state: RootState): string[] => state.layer.present.selected;
export const getAllArtboardIds = (state: RootState): string[] => state.layer.present.allArtboardIds;
export const getLayersById = (state: RootState): { [id: string]: Btwx.Layer } => state.layer.present.byId;
export const getChildrenById = (state: RootState): { [id: string]: string[] } => state.layer.present.childrenById;
export const getAllEventIds = (state: RootState): string[] => state.layer.present.events.allIds;
export const getEventsById = (state: RootState): { [id: string]: Btwx.TweenEvent } => state.layer.present.events.byId;
export const getTweensById = (state: RootState): { [id: string]: Btwx.Tween } => state.layer.present.tweens.byId;
export const getLayerById = (state: RootState, id: string): Btwx.Layer => state.layer.present.byId[id];
export const getLayerChildren = (state: RootState, id: string): string[] => state.layer.present.byId[id].children;
export const getPageChildren = (state: RootState): string[] => state.layer.present.byId['page'].children;
export const getHover = (state: RootState): string => state.layer.present.hover;
export const getHoverItem = (state: RootState): Btwx.Layer => state.layer.present.byId[state.layer.present.hover];
export const getEventDrawerEvent = (state: RootState): string => state.tweenDrawer.event;
export const getEventDrawerSort = (state: RootState): string => state.tweenDrawer.eventSort;
export const getEventDrawerHover = (state: RootState): string => state.tweenDrawer.eventHover;
export const getActiveArtboard = (state: RootState): string => state.layer.present.activeArtboard;

export const getLayerPaperScopes = createSelector(
  [ getAllArtboardIds ],
  (allArtboardIds) => {
    return ['page', ...allArtboardIds].reduce((result, current, index) => ({
      ...result,
      [current]: paper.PaperScope.get(index + 1)
    }), {}) as { [id: string]: paper.PaperScope };
  }
);

export const getAllPaperScopes = createSelector(
  [ getAllArtboardIds ],
  (allArtboardIds) => {
    return ['ui', 'page', ...allArtboardIds].reduce((result, current, index) => ({
      ...result,
      [current]: paper.PaperScope.get(index)
    }), {}) as { [id: string]: paper.PaperScope };
  }
);

export const getCanvasBounds = createSelector(
  [ getLayerPaperScopes ],
  (layerPaperScopes) => {
    return Object.keys(layerPaperScopes).reduce((result: paper.Rectangle, current, index: number) => {
      const paperScope = layerPaperScopes[current];
      let nextTopLeft;
      let nextBottomRight;
      const topLeft = paperScope.project.activeLayer.bounds.topLeft;
      const bottomRight = paperScope.project.activeLayer.bounds.bottomRight;
      if (index === 0) {
        nextTopLeft = topLeft;
        nextBottomRight = bottomRight;
      } else {
        nextTopLeft = paper.Point.min(result.topLeft, topLeft);
        nextBottomRight = paper.Point.max(result.bottomRight, bottomRight);
      }
      return new uiPaperScope.Rectangle({
        from: nextTopLeft,
        to: nextBottomRight
      });
    }, null);
  }
);

export const getReverseSelected = createSelector(
  [ getSelected ],
  (selected) => {
    return selected.reverse();
  }
);

export const getTreeWalker = createSelector(
  [ getChildrenById ],
  (childrenById) => {
    const getNodeData = (node: any, nestingLevel: number): any => ({
      data: {
        id: node.id, // mandatory
        isLeaf: node.children && node.children.length === 0,
        isOpenByDefault: true, // mandatory
        // isOpen: node.children && node.showChildren,
        nestingLevel,
      },
      nestingLevel,
      node,
    });
    function* treeWalker(): any {
      for (let i = childrenById['page'].length - 1; i >= 0; i--) {
        const id = childrenById['page'][i];
        yield getNodeData({
          id: id,
          children: childrenById[id]
        }, 0);
      }
      while (true) {
        const parent = yield;

        if (parent.node.children) {
          for (let i = parent.node.children.length - 1; i >= 0; i--) {
            const id = parent.node.children[i];
            yield getNodeData({
              id: id,
              children: childrenById[id]
            }, parent.nestingLevel + 1);
          }
        }
      }
    }
    return treeWalker;
  }
);

export const getSelectedById = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result, current) => {
      result = {
        ...result,
        [current]: byId[current]
      }
      return result;
    }, {}) as { [id: string]: Btwx.Layer };
  }
);

export const getSelectedAbsPositions = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result, current) => {
      result = {
        ...result,
        [current]: getAbsolutePosition({byId} as LayerState, current)
      }
      return result;
    }, {}) as { [id: string]: paper.Point };
  }
);

export const getSelectedPaperScopes = createSelector(
  [ getSelectedById, getLayersById ],
  (selectedById, byId) => {
    return Object.keys(selectedById).reduce((result, current) => {
      result = {
        ...result,
        [current]: getLayerPaperScope({byId} as LayerState, current)
      }
      return result;
    }, {}) as { [id: string]: number };
  }
);

export const getSelectedAndDescendents = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result, current) => {
      const groups: string[] = [current];
      const layers: string[] = [];
      let i = 0;
      while(i < groups.length) {
        const layerItem = byId[groups[i]];
        if (layerItem.children) {
          layerItem.children.forEach((child) => {
            const childLayerItem = byId[child];
            if (childLayerItem.children && childLayerItem.children.length > 0) {
              groups.push(child);
            }
            layers.push(child);
          });
        }
        i++;
      }
      result = [...result, ...layers];
      return result;
    }, [...selected]);
  }
);

export const getSelectedWithDescendentsById = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    const groups: string[] = [selected[0]];
    const layers: { [id: string]: Btwx.Layer } = {};
    let i = 0;
    while(i < groups.length) {
      const layerItem = byId[groups[i]];
      if (layerItem.children) {
        layerItem.children.forEach((child) => {
          const childLayerItem = byId[child];
          if (childLayerItem.children && childLayerItem.children.length > 0) {
            groups.push(child);
          }
          layers[child] = childLayerItem;
        });
      }
      i++;
    }
    return layers;
  }
);

export const getSelectedWithParentsById = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result, current) => {
      const layerItem = byId[current];
      const parentItem = byId[layerItem.parent];
      result = {
        ...result,
        [current]: layerItem,
        [layerItem.parent]: parentItem
      }
      return result;
    }, {}) as { [id: string]: Btwx.Layer };
  }
);

export const getSelectedBounds = createSelector(
  [ getSelected, getLayersById ],
  (selected, byId) => {
    return selected.reduce((result: paper.Rectangle, current: string, index: number) => {
      let nextTopLeft;
      let nextBottomRight;
      const layerItem = byId[current];
      const isArtboardLayer = layerItem.artboardLayer;
      const hasArtboard = isArtboardLayer && (layerItem as Btwx.ArtboardLayer).artboard;
      const artboardItem = hasArtboard ? byId[(layerItem as Btwx.ArtboardLayer).artboard] : null;
      const layerPosition = new uiPaperScope.Point(layerItem.frame.x, layerItem.frame.y);
      const artboardPosition = artboardItem ? new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y) : new uiPaperScope.Point(0, 0);
      const absolutePosition = artboardPosition.add(layerPosition);
      const topLeft = new uiPaperScope.Point(absolutePosition.x - (layerItem.frame.width / 2), absolutePosition.y - (layerItem.frame.height / 2));
      const bottomRight = new uiPaperScope.Point(absolutePosition.x + (layerItem.frame.width / 2), absolutePosition.y + (layerItem.frame.height / 2));
      if (index === 0) {
        nextTopLeft = topLeft;
        nextBottomRight = bottomRight;
      } else {
        nextTopLeft = paper.Point.min(result.topLeft, topLeft);
        nextBottomRight = paper.Point.max(result.bottomRight, bottomRight);
      }
      return new uiPaperScope.Rectangle({
        from: nextTopLeft,
        to: nextBottomRight
      });
    }, null) as paper.Rectangle;
  }
);

export const getActiveArtboardBounds = createSelector(
  [ getActiveArtboard, getLayersById ],
  (activeArtboard, byId) => {
    if (activeArtboard) {
      const artboardItem = byId[activeArtboard];
      return new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(artboardItem.frame.x - (artboardItem.frame.width / 2), artboardItem.frame.y - (artboardItem.frame.height / 2)),
        to: new uiPaperScope.Point(artboardItem.frame.x + (artboardItem.frame.width / 2), artboardItem.frame.y + (artboardItem.frame.height / 2))
      })
    } else {
      return null;
    }
  }
);

export const getHoverPaperItem = createSelector(
  [ getHover, getLayersById ],
  (hover, byId) => {
    if (hover) {
      const { layerItem, paperLayer } = getItemLayers({byId} as LayerState, hover);
      return paperLayer;
    } else {
      return null;
    }
  }
);

export const canToggleSelectedFillOrStroke = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.every((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.type === 'Shape' || layerItem.type === 'Text';
    });
  }
);

export const selectedFillsEnabled = createSelector(
  [ canToggleSelectedFillOrStroke, getSelectedById ],
  (canToggle, selectedById) => {
    const keys = Object.keys(selectedById);
    return canToggle && keys.every((id) => selectedById[id].style.fill.enabled);
  }
);

export const selectedStrokesEnabled = createSelector(
  [ canToggleSelectedFillOrStroke, getSelectedById ],
  (canToggle, selectedById) => {
    const keys = Object.keys(selectedById);
    return canToggle && keys.every((id) => selectedById[id].style.stroke.enabled);
  }
);

export const canToggleSelectedShadow = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.every((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image';
    });
  }
);

export const selectedShadowsEnabled = createSelector(
  [ canToggleSelectedShadow, getSelectedById ],
  (canToggle, selectedById) => {
    const keys = Object.keys(selectedById);
    return canToggle && keys.every((id) => selectedById[id].style.shadow.enabled);
  }
);

export const canBooleanSelected = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length >= 2 && keys.every((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType !== 'Line';
    });
  }
);

export const canFlipSeleted = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.every((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.type !== 'Artboard';
    });
  }
);

export const selectedHorizontalFlipEnabled = createSelector(
  [ canFlipSeleted, getSelectedById ],
  (canFlip, selectedById) => {
    const keys = Object.keys(selectedById);
    return canFlip && keys.every((id) => selectedById[id].transform.horizontalFlip);
  }
);

export const selectedVerticalFlipEnabled = createSelector(
  [ canFlipSeleted, getSelectedById ],
  (canFlip, selectedById) => {
    const keys = Object.keys(selectedById);
    return canFlip && keys.every((id) => selectedById[id].transform.verticalFlip);
  }
);

export const canToggleSelectedUseAsMask = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.every((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.type === 'Shape';
    });
  }
);

export const selectedUseAsMaskEnabled = createSelector(
  [ canToggleSelectedUseAsMask, getSelectedById ],
  (canToggle, selectedById) => {
    const keys = Object.keys(selectedById);
    return canToggle && keys.every((id) => (selectedById[id] as Btwx.Shape).mask);
  }
);

export const canToggleSelectedIgnoreUnderlyingMask = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.some((id: string) => {
      const layerItem = selectedById[id];
      return layerItem.underlyingMask;
    });
  }
);

export const selectedIgnoreUnderlyingMaskEnabled = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.every((id) => selectedById[id].ignoreUnderlyingMask);
  }
);

export const canBringSelectedForward = createSelector(
  [ getSelected, getSelectedWithParentsById ],
  (selected, selectedWithParentsById) => {
    return selected.length > 0 && !selected.some((id: string) => {
      const layerItem = selectedWithParentsById[id];
      const parentItem = selectedWithParentsById[layerItem.parent];
      return parentItem.children[parentItem.children.length - 1] === id;
    });
  }
);

export const canSendSelectedBackward = createSelector(
  [ getSelected, getSelectedWithParentsById ],
  (selected, selectedWithParentsById) => {
    return selected.length > 0 && !selected.some((id: string) => {
      const layerItem = selectedWithParentsById[id];
      const parentItem = selectedWithParentsById[layerItem.parent];
      return parentItem.children[0] === id;
    });
  }
);

export const canGroupSelected = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.every((id) => selectedById[id].type !== 'Artboard');
  }
);

export const canUngroupSelected = createSelector(
  [ getSelectedById ],
  (selectedById) => {
    const keys = Object.keys(selectedById);
    return keys.length > 0 && keys.some((id) => selectedById[id].type === 'Group');
  }
);

export const getEventsByOriginArtboard = createSelector(
  [ getArtboardEventOriginIds, getEventsById ],
  (eventOriginIds, eventsById) => ({
    allIds: eventOriginIds,
    byId: eventOriginIds.reduce((result, current) => ({
      ...result,
      [current]: eventsById[current]
    }), {})
  }) as {
    allIds: string[];
    byId: {
      [id: string]: Btwx.TweenEvent;
    };
  }
);

export const getEventsByDestinationArtboard = createSelector(
  [ getArtboardEventDestinationIds, getEventsById ],
  (eventDestinationIds, eventsById) => ({
    allIds: eventDestinationIds,
    byId: eventDestinationIds.reduce((result, current) => ({
      ...result,
      [current]: eventsById[current]
    }), {})
  }) as {
    allIds: string[];
    byId: {
      [id: string]: Btwx.TweenEvent;
    };
  }
);

export const getEventsWithArtboard = createSelector(
  [ getEventsByOriginArtboard, getEventsByDestinationArtboard ],
  (originEvents, destinationEvents) => ({
    allIds: [...originEvents.allIds, ...destinationEvents.allIds],
    byId: {
      ...originEvents.byId,
      ...destinationEvents.byId
    }
  })
);

export const getAllArtboardEventsConnectedArtboards = createSelector(
  [ getEventsByOriginArtboard, getLayersById ],
  (originEvents, layersById) => {
    return originEvents.allIds.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Artboard } }, current) => {
      const event = originEvents.byId[current];
      if (!result.allIds.includes(event.destinationArtboard)) {
        result.byId[event.destinationArtboard] = layersById[event.destinationArtboard] as Btwx.Artboard;
        result.allIds = [...result.allIds, event.destinationArtboard];
      }
      if (!result.allIds.includes(event.artboard)) {
        result.byId[event.artboard] = layersById[event.artboard] as Btwx.Artboard;
        result.allIds = [...result.allIds, event.artboard];
      }
      return result;
    }, { allIds: [], byId: {} })
  }
);

export const getAllArtboardEventLayers = createSelector(
  [ getEventsByOriginArtboard, getLayersById ],
  (originEvents, layersById) => {
    return originEvents.allIds.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Layer } }, current) => {
      const event = originEvents.byId[current];
      if (!result.allIds.includes(event.layer)) {
        result.byId[event.layer] = layersById[event.layer] as Btwx.Artboard;
        result.allIds = [...result.allIds, event.layer];
      }
      return result;
    }, { allIds: [], byId: {} })
  }
);

export const getAllArtboardTweens = createSelector(
  [ getEventsByOriginArtboard, getTweensById ],
  (originEvents, tweensById) => {
    return originEvents.allIds.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Tween } }, current) => {
      const event = originEvents.byId[current];
      event.tweens.forEach((tween) => {
        result.byId[tween] = tweensById[tween];
        result.allIds = [...result.allIds, tween]
      });
      return result;
    }, { allIds: [], byId: {} })
  }
);

export const getAllArtboardTweenLayers = createSelector(
  [ getAllArtboardTweens, getLayersById ],
  (tweens, layersById) => {
    return tweens.allIds.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Layer } }, current) => {
      const tween = tweens.byId[current];
      const layerId = tween.layer;
      if (!result.allIds.includes(layerId)) {
        result.byId[layerId] = layersById[layerId];
        result.allIds = [...result.allIds, layerId]
      }
      return result;
    }, { allIds: [], byId: {} })
  }
);

export const getAllArtboardTweenDestinationLayers = createSelector(
  [ getAllArtboardTweens, getLayersById ],
  (tweens, layersById) => {
    return tweens.allIds.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Layer } }, current) => {
      const tween = tweens.byId[current];
      const layerId = tween.destinationLayer;
      if (!result.allIds.includes(layerId)) {
        result.byId[layerId] = layersById[layerId];
        result.allIds = [...result.allIds, layerId]
      }
      return result;
    }, { allIds: [], byId: {} })
  }
);

export const getSortedEvents = createSelector(
  [ getAllEventIds, getEventsById, getEventDrawerSort, getLayersById ],
  (allEventIds, eventById, eventSort, layerById) => {
    const getSort = (sortBy: 'layer' | 'event' | 'artboard' | 'destinationArtboard'): string[] => {
      return [...allEventIds].sort((a, b) => {
        const eventA = eventById[a];
        const eventB = eventById[b];
        let sortA;
        let sortB;
        switch(sortBy) {
          case 'layer':
          case 'artboard':
          case 'destinationArtboard':
            sortA = layerById[eventA[sortBy]].name.toUpperCase();
            sortB = layerById[eventB[sortBy]].name.toUpperCase();
            break;
          case 'event':
            sortA = eventA[sortBy].toUpperCase();
            sortB = eventB[sortBy].toUpperCase();
            break;
        }
        if (sortA < sortB) {
          return -1;
        }
        if (sortA > sortB) {
          return 1;
        }
        return 0;
      });
    }
    if (eventSort !== 'none') {
      switch(eventSort) {
        case 'layer-asc':
          return getSort('layer');
        case 'layer-dsc':
          return getSort('layer').reverse();
        case 'event-asc':
          return getSort('event');
        case 'event-dsc':
          return getSort('event').reverse();
        case 'artboard-asc':
          return getSort('artboard');
        case 'artboard-dsc':
          return getSort('artboard').reverse();
        case 'destinationArtboard-asc':
          return getSort('destinationArtboard');
        case 'destinationArtboard-dsc':
          return getSort('destinationArtboard').reverse();
      }
    } else {
      return allEventIds;
    }
  }
);

export const getActiveArtboardSortedEvents = createSelector(
  [ getSortedEvents, getActiveArtboard, getEventsById  ],
  (sortedEvents, activeArtboard, eventById) => {
    const activeArtboardEvents = activeArtboard ? sortedEvents.filter((id) => eventById[id].artboard === activeArtboard).reverse() : [];
    const otherEventIds = activeArtboard ? sortedEvents.filter((id) => eventById[id].artboard !== activeArtboard).reverse() : sortedEvents.reverse();
    const eventIds = [...activeArtboardEvents, ...otherEventIds];
    return {
      allIds: eventIds,
      activeArtboardEvents,
      otherEventIds
    };
  }
);

export const getArtboardEventItems = createSelector(
  [ getSortedEvents, getActiveArtboard, getEventDrawerEvent, getEventsById, getLayersById  ],
  (sortedEvents, activeArtboard, eventDrawerEvent, eventById, layerById) => {
    let eventItems: Btwx.TweenEvent[];
    let eventLayers: {
      allIds: string[];
      byId: {
        [id: string]: Btwx.Layer;
      };
    };
    if (eventDrawerEvent) {
      const eventItem = eventById[eventDrawerEvent];
      const eventLayer = eventItem.layer;
      const eventLayerItem = layerById[eventLayer];
      eventItems = [eventById[eventDrawerEvent]],
      eventLayers = {
        allIds: [eventLayer],
        byId: {
          [eventLayer]: eventLayerItem
        }
      }
    } else {
      const activeArtboardEvents = activeArtboard ? sortedEvents.filter((id) => eventById[id].artboard === activeArtboard) : [];
      const otherEventIds = activeArtboard ? sortedEvents.filter((id) => eventById[id].artboard !== activeArtboard) : sortedEvents;
      const eventIds = [...activeArtboardEvents, ...otherEventIds];
      eventItems = eventIds.reduce((result, current) => {
        return [...result, eventById[current]];
      }, []);
      eventLayers = eventItems.reduce((result, current) => {
        const eventLayer = current.layer;
        const eventLayerItem = layerById[eventLayer];
        result.allIds = [...result.allIds, eventLayer];
        result.byId = {
          ...result.byId,
          [eventLayer]: eventLayerItem
        }
        return result;
      }, {
        allIds: [],
        byId: {}
      });
    }
    return {
      tweenEventItems: eventItems,
      tweenEventLayers: eventLayers
    }
  }
);

export const getLayer = (store: LayerState, id: string): Btwx.Layer => {
  return store.byId[id] as Btwx.Layer;
};

export const getParentLayer = (store: LayerState, id: string): Btwx.Group => {
  const layer = getLayer(store, id);
  return store.byId[layer.parent] as Btwx.Group;
};

export const getLayerIndex = (store: LayerState, id: string): number => {
  const layerItem = store.byId[id];
  if (layerItem.type === 'Page') {
    return 0;
  } else {
    const parentItem = store.byId[layerItem.parent];
    return parentItem.children.indexOf(id);
  }
};

export const getLayerType = (store: LayerState, id: string): Btwx.LayerType => {
  const layer = getLayer(store, id);
  return layer.type;
};

export const getPaperLayerByPaperId = (id: string): paper.Item => {
  return uiPaperScope.project.getItem({ data: { id } });
};

export const getSelectedPaperLayers = (): paper.Item[] => {
  return uiPaperScope.projects.reduce((result, current, index) => {
    if (index !== 1) {
      const selectedItems = current.getItems({data: {selected: true}});
      result = selectedItems ? [...result, ...selectedItems] : result;
    }
    return result;
  }, []);
};

export const getLayerProject = (store: LayerState, id: string): string => {
  const layerItem = store.byId[id];
  if (layerItem.type === 'Artboard') {
    return layerItem.id;
  } else if (layerItem.artboardLayer && (layerItem as Btwx.ArtboardLayer).artboard) {
    return (layerItem as Btwx.ArtboardLayer).artboard;
  } else {
    return 'page';
  }
};

export const getLayerPaperScope = (store: LayerState, id: string): number => {
  const layerItem = store.byId[id];
  if (layerItem.type === 'Artboard') {
    return (layerItem as Btwx.Artboard).paperScope;
  } else if (layerItem.artboardLayer && (layerItem as Btwx.ArtboardLayer).artboard) {
    const artboardItem = store.byId[(layerItem as Btwx.ArtboardLayer).artboard] as Btwx.Artboard;
    return artboardItem.paperScope;
  } else {
    return 1;
  }
};

export const getPaperLayer = (id: string, paperScope: number): paper.Item => {
  const paperScopeItem = paper.PaperScope.get(paperScope);
  if (paperScopeItem && paperScopeItem.project) {
    return paperScopeItem.project.getItem({ data: { id } });
  } else {
    return null;
  }
};

export const getItemLayers = (store: LayerState, id: string): {
  layerItem: Btwx.Layer;
  paperLayer: paper.Item;
} => {
  const layerItem = store.byId[id];
  const paperLayer = getPaperLayer(id, getLayerPaperScope(store, id));
  return { layerItem, paperLayer };
};

export const getParentPaperLayer = (id: string, paperScope: number, ignoreUnderlyingMask?: boolean): paper.Item => {
  console.log(paper.PaperScope.get(paperScope));
  const paperLayer = getPaperLayer(id, paperScope);
  const isArtboard = paperLayer.data.layerType === 'Artboard';
  const nextPaperLayer = isArtboard ? paperLayer.getItem({ data: { id: 'artboardLayers' } }) : paperLayer;
  const parentChildren = nextPaperLayer.children;
  const hasChildren = parentChildren.length > 0;
  const lastChildPaperLayer = hasChildren ? nextPaperLayer.lastChild : null;
  const isLastChildMask = lastChildPaperLayer && (lastChildPaperLayer.data.id as string).endsWith('maskGroup');
  const underlyingMask = lastChildPaperLayer ? isLastChildMask ? lastChildPaperLayer : lastChildPaperLayer.parent : null;
  if (underlyingMask && !ignoreUnderlyingMask) {
    return underlyingMask;
  } else {
    return nextPaperLayer;
  }
};

export const getLayerDescendants = (state: LayerState, layer: string): string[] => {
  const groups: string[] = [layer];
  const layers: string[] = [];
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        layers.push(child);
      });
    }
    i++;
  }
  return layers;
};

export const getLayerAndDescendants = (state: LayerState, layer: string): string[] => {
  const children = getLayerDescendants(state, layer);
  return [layer, ...children];
};

export const getLayerUnderlyingSiblings = (state: LayerState, id: string) => {
  const layerItem = state.byId[id];
  const parentLayerItem = state.byId[layerItem.parent];
  const layerIndex = parentLayerItem.children.indexOf(id);
  return parentLayerItem.children.reduce((result, current, index) => {
    if (index > layerIndex) {
      result = [...result, current];
    }
    return result;
  }, []);
};

export const getMaskableUnderlyingSiblings = (state: LayerState, id: string, suppliedUnderlyingSiblings?: string[]): string[] => {
  const maskableUnderlyingSiblings = [];
  const underlyingSiblings = suppliedUnderlyingSiblings ? suppliedUnderlyingSiblings : getLayerUnderlyingSiblings(state, id);
  let continueMaskChain = true;
  let i = 0;
  while(i < underlyingSiblings.length && continueMaskChain) {
    const child = underlyingSiblings[i];
    const childItem = state.byId[child];
    if (childItem.ignoreUnderlyingMask) {
      continueMaskChain = false;
    } else {
      if (childItem.type === 'Shape' && (childItem as Btwx.Shape).mask) {
        continueMaskChain = false;
      }
      maskableUnderlyingSiblings.push(child);
    }
    i++;
  }
  return maskableUnderlyingSiblings;
};

export const getSiblingLayersWithUnderlyingMask = (state: LayerState, id: string, suppliedUnderlyingSiblings?: string[]): string[] => {
  const underlyingSiblings = suppliedUnderlyingSiblings ? suppliedUnderlyingSiblings : getLayerUnderlyingSiblings(state, id);
  return underlyingSiblings.filter((sibling) => state.byId[sibling].underlyingMask === id);
};

export const getLayerDepth = (store: LayerState, id: string): number => {
  let depth = 0;
  let currentNode = getParentLayer(store, id);
  while(currentNode.type === 'Group' || currentNode.type === 'Artboard' || currentNode.type === 'CompoundShape') {
    currentNode = getParentLayer(store, currentNode.id);
    depth++;
  }
  return depth;
};

export const getScopeLayers = (store: LayerState): string[] => {
  const rootItems = getLayer(store, 'page').children;
  const expandedItems = store.scope.reduce((result, current) => {
    const layer = getLayer(store, current);
    result = [...result, ...layer.children];
    return result;
  }, []);
  return [...rootItems, ...expandedItems];
};

export const getScopeGroupLayers = (store: LayerState): string[] => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.reduce((result, current) => {
    const layer = getLayer(store, current);
    if (layer.type === 'Group' || layer.type === 'Artboard') {
      result = [...result, current];
    }
    return result;
  }, []);
};

export const isScopeLayer = (store: LayerState, id: string): boolean => {
  const scope = store.byId[id].scope;
  return store.scope.includes(scope[scope.length - 1]);
};

export const isScopeGroupLayer = (store: LayerState, id: string): boolean => {
  const expandableLayers = getScopeGroupLayers(store);
  return expandableLayers.includes(id);
};

export const getNearestScopeAncestor = (store: LayerState, id: string): Btwx.Layer => {
  let currentNode = store.byId[id];
  while(currentNode.scope.length > 1 && !store.scope.includes(currentNode.scope[currentNode.scope.length - 1])) {
    currentNode = store.byId[currentNode.parent];
  }
  return currentNode;
};

export const getDeepSelectItem = (store: LayerState, id: string): Btwx.Layer => {
  const layerItem = store.byId[id];
  const layerScope = layerItem.scope;
  const nearestScopeAncestor = getNearestScopeAncestor(store, id);
  const nearestScopeAncestorIndex = layerScope.indexOf(nearestScopeAncestor.id);
  if (nearestScopeAncestor.id !== id) {
    if (layerScope[layerScope.length - 1] === nearestScopeAncestor.id) {
      return store.byId[id];
    } else {
      return store.byId[layerScope[nearestScopeAncestorIndex + 1]];
    }
  } else {
    return store.byId[id];
  }
};

export const getNearestScopeGroupAncestor = (store: LayerState, id: string): Btwx.Layer => {
  let currentNode = getLayer(store, id);
  while(!isScopeGroupLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
};

export const getPaperLayersBounds = (layers: paper.Item[]): paper.Rectangle => {
  return layers.reduce((result: paper.Rectangle, current, index) => {
    if (index === 0) {
      result = current.bounds;
    } else {
      const topLeft = paper.Point.min(result.topLeft, current.bounds.topLeft);
      const bottomRight = paper.Point.max(result.bottomRight, current.bounds.bottomRight);
      result = new uiPaperScope.Rectangle({
        from: topLeft,
        to: bottomRight
      });
    }
    return result;
  }, null);
};

export const getClosestPaperLayer = (point: paper.Point, layers: paper.Item[]): paper.Item => {
  return layers.reduce((result: { paperLayer: paper.Item; distance: number }, current) => {
    const currentDistance = point.getDistance(current.bounds.center);
    if (result.distance) {
      if (currentDistance < result.distance) {
        return { paperLayer: current, distance: currentDistance };
      } else {
        return result;
      }
    } else {
      return { paperLayer: current, distance: currentDistance };
    }
  }, { paperLayer: null, distance: null }).paperLayer;
};

export const getLayersBounds = (store: LayerState, layers: string[]): paper.Rectangle => {
  return layers.reduce((result: paper.Rectangle, current, index) => {
    let nextTopLeft;
    let nextBottomRight;
    const layerItem = store.byId[current];
    const isArtboardLayer = layerItem.artboardLayer;
    const hasArtboard = isArtboardLayer && (layerItem as Btwx.ArtboardLayer).artboard;
    const artboardItem = hasArtboard ? store.byId[(layerItem as Btwx.ArtboardLayer).artboard] : null;
    const layerPosition = new uiPaperScope.Point(layerItem.frame.x, layerItem.frame.y);
    const artboardPosition = artboardItem ? new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y) : new uiPaperScope.Point(0, 0);
    const absolutePosition = artboardPosition.add(layerPosition);
    const topLeft = new uiPaperScope.Point(absolutePosition.x - (layerItem.frame.width / 2), absolutePosition.y - (layerItem.frame.height / 2));
    const bottomRight = new uiPaperScope.Point(absolutePosition.x + (layerItem.frame.width / 2), absolutePosition.y + (layerItem.frame.height / 2));
    if (index === 0) {
      nextTopLeft = topLeft;
      nextBottomRight = bottomRight;
    } else {
      nextTopLeft = paper.Point.min(result.topLeft, topLeft);
      nextBottomRight = paper.Point.max(result.bottomRight, bottomRight);
    }
    return new uiPaperScope.Rectangle({
      from: nextTopLeft,
      to: nextBottomRight
    });
  }, null);
};

export const getClipboardTopLeft = (layerItems: Btwx.Layer[]): paper.Point => {
  const paperLayerPoints = layerItems.reduce((result, current) => {
    const layerItem = current;
    const topLeft = new uiPaperScope.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
    return [...result, topLeft];
  }, []);
  return paperLayerPoints.length > 0 ? paperLayerPoints.reduce(paper.Point.min) : null;
};

export const getClipboardBottomRight = (layerItems: Btwx.Layer[]): paper.Point => {
  const paperLayerPoints = layerItems.reduce((result, current) => {
    const layerItem = current;
    const bottomRight = new uiPaperScope.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
    return [...result, bottomRight];
  }, []);
  return paperLayerPoints.length > 0 ? paperLayerPoints.reduce(paper.Point.max) : null;
};

export const getClipboardCenter = (layerItems: Btwx.Layer[]): paper.Point => {
  const topLeft = getClipboardTopLeft(layerItems);
  const bottomRight = getClipboardBottomRight(layerItems);
  const bounds = new uiPaperScope.Rectangle({
    from: topLeft,
    to: bottomRight
  });
  return bounds.center;
};

export const getDestinationEquivalent = (store: LayerState, layer: string, destinationChildren: string[]): Btwx.Layer => {
  const layerItem = store.byId[layer];
  const equivalent = destinationChildren.reduce((result: Btwx.Layer, current) => {
    const childLayer = store.byId[current];
    if (childLayer.name === layerItem.name && childLayer.type === layerItem.type) {
      if (result) {
        const layerScope = layerItem.scope;
        const layerArtboard = store.byId[layerScope[1]] as Btwx.Artboard;
        const resultScope = store.byId[result.id].scope;
        const childArtboard = store.byId[resultScope[1]] as Btwx.Artboard;
        const layerArtboardPosition = getPositionInArtboard(layerItem, layerArtboard);
        const resultArtboardPosition = getPositionInArtboard(result, childArtboard);
        const childArtboardPosition = getPositionInArtboard(childLayer, childArtboard);
        const resultDistance = new uiPaperScope.Point(resultArtboardPosition.x, resultArtboardPosition.y).subtract(new uiPaperScope.Point(layerArtboardPosition.x, layerArtboardPosition.y));
        const childDistance = new uiPaperScope.Point(childArtboardPosition.x, childArtboardPosition.y).subtract(new uiPaperScope.Point(layerArtboardPosition.x, layerArtboardPosition.y));
        if (childDistance.length < resultDistance.length) {
          result = childLayer;
        }
      } else {
        result = childLayer;
      }
    }
    return result;
  }, null);
  return equivalent;
};

export const getPositionInArtboard = (layer: Btwx.Layer, artboard: Btwx.Artboard): paper.Point => {
  const xDiff = layer.frame.x - (artboard.frame.x - (artboard.frame.width / 2));
  const yDiff = layer.frame.y - (artboard.frame.y - (artboard.frame.height / 2));
  return new paper.Point(parseInt(xDiff.toFixed(2)), parseInt(yDiff.toFixed(2)));
};

export const hasImageTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    layerItem.type === 'Image' &&
    equivalentLayerItem.type === 'Image' &&
    (layerItem as Btwx.Image).imageId !== (equivalentLayerItem as Btwx.Image).imageId
  );
};

export const hasShapeTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    layerItem.type === 'Shape' &&
    equivalentLayerItem.type === 'Shape' &&
    (
      (layerItem as Btwx.Shape).shapeType !== (equivalentLayerItem as Btwx.Shape).shapeType ||
      (layerItem as Btwx.Shape).shapeType === 'Polygon' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Polygon' && (layerItem as Btwx.Polygon).sides !== (equivalentLayerItem as Btwx.Polygon).sides ||
      (layerItem as Btwx.Shape).shapeType === 'Star' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Star' && (layerItem as Btwx.Star).points !== (equivalentLayerItem as Btwx.Star).points
    )
  );
};

export const hasFillTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text') &&
    (layerItem.style.fill.enabled || equivalentLayerItem.style.fill.enabled) &&
    (
      (layerItem.style.fill.enabled && !equivalentLayerItem.style.fill.enabled) ||
      (!layerItem.style.fill.enabled && equivalentLayerItem.style.fill.enabled) ||
      layerItem.style.fill.fillType !== equivalentLayerItem.style.fill.fillType ||
      layerItem.style.fill.fillType === 'color' && equivalentLayerItem.style.fill.fillType === 'color' && !colorsMatch(layerItem.style.fill.color, equivalentLayerItem.style.fill.color) ||
      layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient' && !gradientsMatch(layerItem.style.fill.gradient, equivalentLayerItem.style.fill.gradient)
    )
  );
};

export const hasFillGradientOriginXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const fillTween = hasFillTween(layerItem, equivalentLayerItem);
  const hasFillGradientTween = fillTween && (layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient');
  const sameOriginX =  layerItem.style.fill.gradient.origin.x.toFixed(2) === equivalentLayerItem.style.fill.gradient.origin.x.toFixed(2);
  return hasFillGradientTween && !sameOriginX;
};

export const hasFillGradientOriginYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const fillTween = hasFillTween(layerItem, equivalentLayerItem);
  const hasFillGradientTween = fillTween && (layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient');
  const sameOriginY =  layerItem.style.fill.gradient.origin.y.toFixed(2) === equivalentLayerItem.style.fill.gradient.origin.y.toFixed(2);
  return hasFillGradientTween && !sameOriginY;
};

export const hasFillGradientDestinationXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const fillTween = hasFillTween(layerItem, equivalentLayerItem);
  const hasFillGradientTween = fillTween && (layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient');
  const sameOriginX =  layerItem.style.fill.gradient.destination.x.toFixed(2) === equivalentLayerItem.style.fill.gradient.destination.x.toFixed(2);
  return hasFillGradientTween && !sameOriginX;
};

export const hasFillGradientDestinationYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const fillTween = hasFillTween(layerItem, equivalentLayerItem);
  const hasFillGradientTween = fillTween && (layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient');
  const sameOriginY =  layerItem.style.fill.gradient.destination.y.toFixed(2) === equivalentLayerItem.style.fill.gradient.destination.y.toFixed(2);
  return hasFillGradientTween && !sameOriginY;
};

export const hasXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer, artboardLayerItem: Btwx.Artboard, destinationArtboardLayerItem: Btwx.Artboard): boolean => {
  const layerArtboardPosition = getPositionInArtboard(layerItem, artboardLayerItem);
  const equivalentArtboardPosition = getPositionInArtboard(equivalentLayerItem, destinationArtboardLayerItem);
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const groupToGroup = layerItem.type === 'Group' && equivalentLayerItem.type === 'Group';
  const textToText = layerItem.type === 'Text' && equivalentLayerItem.type === 'Text';
  const fontSizeMatch = textToText && (layerItem as Btwx.Text).textStyle.fontSize === (equivalentLayerItem as Btwx.Text).textStyle.fontSize;
  const leadingsMatch = textToText && (layerItem as Btwx.Text).textStyle.leading === (equivalentLayerItem as Btwx.Text).textStyle.leading;
  const positionsMatch = layerArtboardPosition.x === equivalentArtboardPosition.x;
  return (!lineToLine && !groupToGroup && !positionsMatch) || (textToText && (!fontSizeMatch || !leadingsMatch));
};

export const hasYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer, artboardLayerItem: Btwx.Artboard, destinationArtboardLayerItem: Btwx.Artboard): boolean => {
  const layerArtboardPosition = getPositionInArtboard(layerItem, artboardLayerItem);
  const equivalentArtboardPosition = getPositionInArtboard(equivalentLayerItem, destinationArtboardLayerItem);
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const groupToGroup = layerItem.type === 'Group' && equivalentLayerItem.type === 'Group';
  const textToText = layerItem.type === 'Text' && equivalentLayerItem.type === 'Text';
  const fontSizeMatch = textToText && (layerItem as Btwx.Text).textStyle.fontSize === (equivalentLayerItem as Btwx.Text).textStyle.fontSize;
  const leadingsMatch = textToText && (layerItem as Btwx.Text).textStyle.leading === (equivalentLayerItem as Btwx.Text).textStyle.leading;
  const positionsMatch = layerArtboardPosition.y === equivalentArtboardPosition.y;
  return (!lineToLine && !groupToGroup && !positionsMatch) || (textToText && (!fontSizeMatch || !leadingsMatch));
};

export const hasRotationTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const groupToGroup = layerItem.type === 'Group' && equivalentLayerItem.type === 'Group';
  const rotationsMatch = layerItem.transform.rotation.toFixed(2) === equivalentLayerItem.transform.rotation.toFixed(2);
  return !lineToLine && !groupToGroup && !rotationsMatch;
};

export const hasWidthTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const layerItemValid = ((layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType !== 'Line') || layerItem.type === 'Image');
  const equivalentLayerItemValid = ((equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType !== 'Line') || equivalentLayerItem.type === 'Image');
  const widthsMatch = Math.round(layerItem.frame.innerWidth) === Math.round(equivalentLayerItem.frame.innerWidth);
  return !lineToLine && (layerItemValid && equivalentLayerItemValid) && !widthsMatch;
};

export const hasHeightTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    ((layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType !== 'Line') || layerItem.type === 'Image') &&
    ((equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType !== 'Line') || equivalentLayerItem.type === 'Image') &&
    Math.round(layerItem.frame.innerHeight) !== Math.round(equivalentLayerItem.frame.innerHeight)
  );
};

export const hasStrokeTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    (
      (layerItem.style.stroke.enabled && !equivalentLayerItem.style.stroke.enabled) ||
      (!layerItem.style.stroke.enabled && equivalentLayerItem.style.stroke.enabled) ||
      layerItem.style.stroke.fillType !== equivalentLayerItem.style.stroke.fillType ||
      layerItem.style.stroke.fillType === 'color' && equivalentLayerItem.style.stroke.fillType === 'color' && !colorsMatch(layerItem.style.stroke.color, equivalentLayerItem.style.stroke.color) ||
      layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient' && !gradientsMatch(layerItem.style.stroke.gradient, equivalentLayerItem.style.stroke.gradient)
    )
  );
};

export const hasStrokeGradientOriginXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const strokeTween = hasStrokeTween(layerItem, equivalentLayerItem);
  const hasStrokeGradientTween = strokeTween && (layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient');
  const sameOriginX = layerItem.style.stroke.gradient.origin.x.toFixed(2) === equivalentLayerItem.style.stroke.gradient.origin.x.toFixed(2);
  return hasStrokeGradientTween && !sameOriginX;
};

export const hasStrokeGradientOriginYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const strokeTween = hasStrokeTween(layerItem, equivalentLayerItem);
  const hasStrokeGradientTween = strokeTween && (layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient');
  const sameOriginY =  layerItem.style.stroke.gradient.origin.y.toFixed(2) === equivalentLayerItem.style.stroke.gradient.origin.y.toFixed(2);
  return hasStrokeGradientTween && !sameOriginY;
};

export const hasStrokeGradientDestinationXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const strokeTween = hasStrokeTween(layerItem, equivalentLayerItem);
  const hasStrokeGradientTween = strokeTween && (layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient');
  const sameOriginX =  layerItem.style.stroke.gradient.destination.x.toFixed(2) === equivalentLayerItem.style.stroke.gradient.destination.x.toFixed(2);
  return hasStrokeGradientTween && !sameOriginX;
};

export const hasStrokeGradientDestinationYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const strokeTween = hasStrokeTween(layerItem, equivalentLayerItem);
  const hasStrokeGradientTween = strokeTween && (layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient');
  const sameOriginY =  layerItem.style.stroke.gradient.destination.y.toFixed(2) === equivalentLayerItem.style.stroke.gradient.destination.y.toFixed(2);
  return hasStrokeGradientTween && !sameOriginY;
};

export const hasDashOffsetTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashOffset.toFixed(2) !== equivalentLayerItem.style.strokeOptions.dashOffset.toFixed(2)
  );
};

export const hasDashArrayWidthTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashArray[0].toFixed(2) !== equivalentLayerItem.style.strokeOptions.dashArray[0].toFixed(2)
  );
};

export const hasDashArrayGapTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashArray[1].toFixed(2) !== equivalentLayerItem.style.strokeOptions.dashArray[1].toFixed(2)
  );
};

export const hasStrokeWidthTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (
      (layerItem.style.stroke.enabled && !equivalentLayerItem.style.stroke.enabled) ||
      (!layerItem.style.stroke.enabled && equivalentLayerItem.style.stroke.enabled) ||
      layerItem.style.stroke.width.toFixed(2) !== equivalentLayerItem.style.stroke.width.toFixed(2)
    )
  );
};

export const hasShadowColorTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (
      (layerItem.style.shadow.enabled && !equivalentLayerItem.style.shadow.enabled) ||
      (!layerItem.style.shadow.enabled && equivalentLayerItem.style.shadow.enabled) ||
      !colorsMatch(layerItem.style.shadow.color, equivalentLayerItem.style.shadow.color)
    )
  );
};

export const hasShadowOffsetXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (
      (layerItem.style.shadow.enabled && !equivalentLayerItem.style.shadow.enabled) ||
      (!layerItem.style.shadow.enabled && equivalentLayerItem.style.shadow.enabled) ||
      layerItem.style.shadow.offset.x.toFixed(2) !== equivalentLayerItem.style.shadow.offset.x.toFixed(2)
    )
  );
};

export const hasShadowOffsetYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (
      (layerItem.style.shadow.enabled && !equivalentLayerItem.style.shadow.enabled) ||
      (!layerItem.style.shadow.enabled && equivalentLayerItem.style.shadow.enabled) ||
      layerItem.style.shadow.offset.y.toFixed(2) !== equivalentLayerItem.style.shadow.offset.y.toFixed(2)
    )
  );
};

export const hasShadowBlurTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (
      (layerItem.style.shadow.enabled && !equivalentLayerItem.style.shadow.enabled) ||
      (!layerItem.style.shadow.enabled && equivalentLayerItem.style.shadow.enabled) ||
      layerItem.style.shadow.blur.toFixed(2) !== equivalentLayerItem.style.shadow.blur.toFixed(2)
    )
  );
};

export const hasOpacityTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return layerItem.style.opacity.toFixed(2) !== equivalentLayerItem.style.opacity.toFixed(2);
};

export const hasFontSizeTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    layerItem.type === 'Text' &&
    equivalentLayerItem.type === 'Text' &&
    (layerItem as Btwx.Text).textStyle.fontSize.toFixed(2) !== (equivalentLayerItem as Btwx.Text).textStyle.fontSize.toFixed(2)
  );
};

export const hasLineHeightTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  return (
    layerItem.type === 'Text' &&
    equivalentLayerItem.type === 'Text' &&
    (layerItem as Btwx.Text).textStyle.leading.toFixed(2) !== (equivalentLayerItem as Btwx.Text).textStyle.leading.toFixed(2)
  );
};

export const hasFromXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const fromXMatch = lineToLine && (layerItem as Btwx.Line).from.x.toFixed(2) === (equivalentLayerItem as Btwx.Line).from.x.toFixed(2);
  const widthsMatch = Math.round(layerItem.frame.innerWidth) === Math.round(equivalentLayerItem.frame.innerWidth);
  return lineToLine && (!fromXMatch || !widthsMatch);
};

export const hasFromYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const fromYMatch = lineToLine && (layerItem as Btwx.Line).from.y.toFixed(2) === (equivalentLayerItem as Btwx.Line).from.y.toFixed(2);
  const widthsMatch = Math.round(layerItem.frame.innerWidth) === Math.round(equivalentLayerItem.frame.innerWidth);
  return lineToLine && (!fromYMatch || !widthsMatch);
};

export const hasToXTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const toXMatch = lineToLine && (layerItem as Btwx.Line).to.x.toFixed(2) === (equivalentLayerItem as Btwx.Line).to.x.toFixed(2);
  const widthsMatch = Math.round(layerItem.frame.innerWidth) === Math.round(equivalentLayerItem.frame.innerWidth);
  return lineToLine && (!toXMatch || !widthsMatch);
};

export const hasToYTween = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as Btwx.Shape).shapeType === 'Line';
  const toYMatch = lineToLine && (layerItem as Btwx.Line).to.y.toFixed(2) === (equivalentLayerItem as Btwx.Line).to.y.toFixed(2);
  const widthsMatch = Math.round(layerItem.frame.innerWidth) === Math.round(equivalentLayerItem.frame.innerWidth);
  return lineToLine && (!toYMatch || !widthsMatch);
};

export const getEquivalentTweenProp = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer, artboardLayerItem: Btwx.Artboard, destinationArtboardLayerItem: Btwx.Artboard, prop: Btwx.TweenProp): boolean => {
  switch(prop) {
    case 'image':
      return hasImageTween(layerItem, equivalentLayerItem);
    case 'shape':
      return hasShapeTween(layerItem, equivalentLayerItem);
    case 'fill':
      return hasFillTween(layerItem, equivalentLayerItem);
    case 'fillGradientOriginX':
      return hasFillGradientOriginXTween(layerItem, equivalentLayerItem);
    case 'fillGradientOriginY':
      return hasFillGradientOriginYTween(layerItem, equivalentLayerItem);
    case 'fillGradientDestinationX':
      return hasFillGradientDestinationXTween(layerItem, equivalentLayerItem);
    case 'fillGradientDestinationY':
      return hasFillGradientDestinationYTween(layerItem, equivalentLayerItem);
    case 'x':
      return hasXTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem);
    case 'y':
      return hasYTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem);
    case 'rotation':
      return hasRotationTween(layerItem, equivalentLayerItem);
    case 'width':
      return hasWidthTween(layerItem, equivalentLayerItem);
    case 'height':
      return hasHeightTween(layerItem, equivalentLayerItem);
    case 'stroke':
      return hasStrokeTween(layerItem, equivalentLayerItem);
    case 'strokeGradientOriginX':
      return hasStrokeGradientOriginXTween(layerItem, equivalentLayerItem);
    case 'strokeGradientOriginY':
      return hasStrokeGradientOriginYTween(layerItem, equivalentLayerItem);
    case 'strokeGradientDestinationX':
      return hasStrokeGradientDestinationXTween(layerItem, equivalentLayerItem);
    case 'strokeGradientDestinationY':
      return hasStrokeGradientDestinationYTween(layerItem, equivalentLayerItem);
    case 'dashOffset':
      return hasDashOffsetTween(layerItem, equivalentLayerItem);
    case 'dashArrayWidth':
      return hasDashArrayWidthTween(layerItem, equivalentLayerItem);
    case 'dashArrayGap':
      return hasDashArrayGapTween(layerItem, equivalentLayerItem);
    case 'strokeWidth':
      return hasStrokeWidthTween(layerItem, equivalentLayerItem);
    case 'shadowColor':
      return hasShadowColorTween(layerItem, equivalentLayerItem);
    case 'shadowOffsetX':
      return hasShadowOffsetXTween(layerItem, equivalentLayerItem);
    case 'shadowOffsetY':
      return hasShadowOffsetYTween(layerItem, equivalentLayerItem);
    case 'shadowBlur':
      return hasShadowBlurTween(layerItem, equivalentLayerItem);
    case 'opacity':
      return hasOpacityTween(layerItem, equivalentLayerItem);
    case 'fontSize':
      return hasFontSizeTween(layerItem, equivalentLayerItem);
    case 'lineHeight':
      return hasLineHeightTween(layerItem, equivalentLayerItem);
    case 'fromX':
      return hasFromXTween(layerItem, equivalentLayerItem);
    case 'fromY':
      return hasFromYTween(layerItem, equivalentLayerItem);
    case 'toX':
      return hasToXTween(layerItem, equivalentLayerItem);
    case 'toY':
      return hasToYTween(layerItem, equivalentLayerItem);
  }
};

export const getEquivalentTweenProps = (layerItem: Btwx.Layer, equivalentLayerItem: Btwx.Layer, artboardLayerItem: Btwx.Artboard, destinationArtboardLayerItem: Btwx.Artboard): Btwx.TweenPropMap => ({
  image: hasImageTween(layerItem, equivalentLayerItem),
  shape: hasShapeTween(layerItem, equivalentLayerItem),
  fill: hasFillTween(layerItem, equivalentLayerItem),
  fillGradientOriginX: hasFillGradientOriginXTween(layerItem, equivalentLayerItem),
  fillGradientOriginY: hasFillGradientOriginYTween(layerItem, equivalentLayerItem),
  fillGradientDestinationX: hasFillGradientDestinationXTween(layerItem, equivalentLayerItem),
  fillGradientDestinationY: hasFillGradientDestinationYTween(layerItem, equivalentLayerItem),
  x: hasXTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem),
  y: hasYTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem),
  rotation: hasRotationTween(layerItem, equivalentLayerItem),
  radius: false,
  width: hasWidthTween(layerItem, equivalentLayerItem),
  height: hasHeightTween(layerItem, equivalentLayerItem),
  stroke: hasStrokeTween(layerItem, equivalentLayerItem),
  strokeGradientOriginX: hasStrokeGradientOriginXTween(layerItem, equivalentLayerItem),
  strokeGradientOriginY: hasStrokeGradientOriginYTween(layerItem, equivalentLayerItem),
  strokeGradientDestinationX: hasStrokeGradientDestinationXTween(layerItem, equivalentLayerItem),
  strokeGradientDestinationY: hasStrokeGradientDestinationYTween(layerItem, equivalentLayerItem),
  dashOffset: hasDashOffsetTween(layerItem, equivalentLayerItem),
  dashArrayWidth: hasDashArrayWidthTween(layerItem, equivalentLayerItem),
  dashArrayGap: hasDashArrayGapTween(layerItem, equivalentLayerItem),
  strokeWidth: hasStrokeWidthTween(layerItem, equivalentLayerItem),
  shadowColor: hasShadowColorTween(layerItem, equivalentLayerItem),
  shadowOffsetX: hasShadowOffsetXTween(layerItem, equivalentLayerItem),
  shadowOffsetY: hasShadowOffsetYTween(layerItem, equivalentLayerItem),
  shadowBlur: hasShadowBlurTween(layerItem, equivalentLayerItem),
  opacity: hasOpacityTween(layerItem, equivalentLayerItem),
  fontSize: hasFontSizeTween(layerItem, equivalentLayerItem),
  lineHeight: hasLineHeightTween(layerItem, equivalentLayerItem),
  fromX: hasFromXTween(layerItem, equivalentLayerItem),
  fromY: hasFromYTween(layerItem, equivalentLayerItem),
  toX: hasToXTween(layerItem, equivalentLayerItem),
  toY: hasToYTween(layerItem, equivalentLayerItem)
});

export const getLongestEventTween = (tweensById: {[id: string]: Btwx.Tween}): Btwx.Tween => {
  return Object.keys(tweensById).reduce((result: Btwx.Tween, current: string) => {
    if (tweensById[current].duration + tweensById[current].delay >= result.duration + result.delay) {
      return tweensById[current];
    } else {
      return result;
    }
  }, tweensById[Object.keys(tweensById)[0]]);
};

export const getTweenEventLayers = (store: LayerState, eventId: string): {
  allIds: string[];
  byId: {
    [id: string]: Btwx.Layer;
  };
} => {
  const tweenEvent = store.events.byId[eventId];
  const allIds: string[] = [];
  const byId = tweenEvent.tweens.reduce((result: { [id: string]: Btwx.Layer }, current) => {
    const tween = store.tweens.byId[current];
    if (!allIds.includes(tween.layer)) {
      result[tween.layer] = store.byId[tween.layer];
      allIds.push(tween.layer);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getTweenEventLayerTweens = (store: LayerState, eventId: string, layerId: string): {
  allIds: string[];
  byId: {
    [id: string]: Btwx.Tween;
  };
} => {
  const tweenEvent = store.events.byId[eventId];
  const allIds: string[] = [];
  const byId = tweenEvent.tweens.reduce((result: { [id: string]: Btwx.Tween }, current) => {
    const tween = store.tweens.byId[current];
    if (tween.layer === layerId) {
      result[current] = tween;
      allIds.push(current);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

// export const getGradientOriginPoint = (layerItem: Btwx.Layer, origin: Btwx.Point): paper.Point => {
//   const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
//   return new uiPaperScope.Point((origin.x * (isLine ? layerItem.frame.width : layerItem.frame.innerWidth)) + layerItem.frame.x, (origin.y * (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)) + layerItem.frame.y);
// };

export const getAbsolutePosition = (store: LayerState, id: string): paper.Point => {
  const layerItem = store.byId[id];
  const layerPosition = new uiPaperScope.Point(layerItem.frame.x, layerItem.frame.y);
  const isArtboardLayer = layerItem.artboardLayer;
  const isArtboardScoped = isArtboardLayer && (layerItem as Btwx.ArtboardLayer).artboard;
  const artboardItem = isArtboardScoped ? store.byId[(layerItem as Btwx.ArtboardLayer).artboard] : null;
  const artboardPosition = new uiPaperScope.Point(artboardItem ? artboardItem.frame.x : 0, artboardItem ? artboardItem.frame.y : 0);
  return layerPosition.add(artboardPosition);
};

export const getGradientOriginPoint = (store: LayerState, id: string, prop: 'fill' | 'stroke'): paper.Point => {
  const layerItem = store.byId[id];
  const gradient = layerItem.style[prop].gradient;
  const origin = gradient.origin;
  // const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const layerPosition = getAbsolutePosition(store, id);
  const originPoint = new uiPaperScope.Point(origin.x, origin.y);
  return layerPosition.add(originPoint);
  // return new uiPaperScope.Point((origin.x * (isLine ? layerItem.frame.width : layerItem.frame.innerWidth)) + layerPosition.x, (origin.y * (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)) + layerPosition.y);
};

// export const getGradientDestinationPoint = (layerItem: Btwx.Layer, destination: Btwx.Point): paper.Point => {
//   const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
//   return new uiPaperScope.Point((destination.x * (isLine ? layerItem.frame.width : layerItem.frame.innerWidth)) + layerItem.frame.x, (destination.y * (isLine ? layerItem.frame.height : layerItem.frame.innerHeight)) + layerItem.frame.y);
// };

export const getGradientDestinationPoint = (store: LayerState, id: string, prop: 'fill' | 'stroke'): paper.Point => {
  const layerItem = store.byId[id];
  const gradient = layerItem.style[prop].gradient;
  const destination = gradient.destination;
  // const isLine = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line';
  const layerPosition = getAbsolutePosition(store, id);
  const destinationPoint = new uiPaperScope.Point(destination.x, destination.y);
  return layerPosition.add(destinationPoint);
};

export const getLineFromPoint = (layerItem: Btwx.Line): paper.Point => {
  return new uiPaperScope.Point((layerItem.from.x * layerItem.frame.innerWidth) + layerItem.frame.x, (layerItem.from.y * layerItem.frame.innerWidth) + layerItem.frame.y);
};

export const getLineToPoint = (layerItem: Btwx.Line): paper.Point => {
  return new uiPaperScope.Point((layerItem.to.x * layerItem.frame.innerWidth) + layerItem.frame.x, (layerItem.to.y * layerItem.frame.innerWidth) + layerItem.frame.y);
};

export const getLineVector = (layerItem: Btwx.Line): paper.Point => {
  const from = getLineFromPoint(layerItem);
  const to = getLineToPoint(layerItem);
  return to.subtract(from)
};

export const getGradientStops = (stops: Btwx.GradientStop[]): paper.GradientStop[] => {
  return stops.reduce((result, current) => {
    result = [
      ...result,
      new uiPaperScope.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)
    ];
    return result;
  }, []);
};

export const orderLayersByDepth = (state: LayerState, layers: string[]): string[] => {
  return layers.sort((a, b) => {
    const layerItemA = state.byId[a];
    const layerItemB = state.byId[b];
    const layerItemAIndex = getLayerIndex(state, a);
    const layerItemBIndex = getLayerIndex(state, b);
    return (layerItemA.scope.length + layerItemAIndex) - (layerItemB.scope.length + layerItemBIndex);
  });
};

export const orderLayersByLeft = (store: LayerState, layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aLayerItems = getItemLayers(store, a);
    const bLayerItems = getItemLayers(store, b);
    return aLayerItems.paperLayer.bounds.left - bLayerItems.paperLayer.bounds.left;
  });
};

export const orderLayersByTop = (store: LayerState, layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aLayerItems = getItemLayers(store, a);
    const bLayerItems = getItemLayers(store, b);
    return aLayerItems.paperLayer.bounds.top - bLayerItems.paperLayer.bounds.top;
  });
};

export const savePaperProjectJSON = (state: LayerState, paperScope: number): string => {
  const paperScopeItem = paper.PaperScope.get(paperScope);
  if (paperScopeItem.project) {
    const projectJSON = paperScopeItem.project.exportJSON();
    const canvasImageBase64ById = state.allImageIds.reduce((result: { [id: string]: string }, current) => {
      const layer = state.byId[current] as Btwx.Image;
      const paperLayer = getPaperLayer(current, paperScope).getItem({data: {id: 'raster'}}) as paper.Raster;
      result[layer.imageId] = paperLayer.source as string;
      return result;
    }, {});
    return Object.keys(canvasImageBase64ById).reduce((result, current) => {
      result = result.replace(canvasImageBase64ById[current], current);
      return result;
    }, projectJSON);
  } else {
    return null;
  }
};

interface ImportPaperProject {
  documentImages: {
    [id: string]: Btwx.DocumentImage;
  };
  paperJSON: string;
  paperScope: number;
}

export const importPaperProject = ({documentImages, paperJSON, paperScope}: ImportPaperProject): void => {
  const paperScopeItem = paper.PaperScope.get(paperScope);
  paperScopeItem.activate();
  paperScopeItem.project.clear();
  const newPaperProject = Object.keys(documentImages).reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(documentImages[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, paperJSON);
  paperScopeItem.project.importJSON(newPaperProject);
};

export const colorsMatch = (color1: Btwx.Color, color2: Btwx.Color): boolean => {
  return Object.keys(color1).every((prop: 'h' | 's' | 'l' | 'v' | 'a') => color1[prop] === color2[prop]);
};

export const gradientsMatch = (gradient1: Btwx.Gradient, gradient2: Btwx.Gradient): boolean => {
  const gradientTypesMatch = gradient1.gradientType === gradient2.gradientType;
  const originsMatch = gradient1.origin.x === gradient2.origin.x && gradient1.origin.y === gradient2.origin.y;
  const destinationsMatch = gradient1.destination.x === gradient2.destination.x && gradient1.destination.y === gradient2.destination.y;
  const g1SortedStops = [...gradient1.stops].sort((a,b) => { return a.position - b.position });
  const g2SortedStops = [...gradient2.stops].sort((a,b) => { return a.position - b.position });
  const stopsLengthMatch = g1SortedStops.length === g2SortedStops.length;
  let stopsMatch = false;
  if (stopsLengthMatch) {
    stopsMatch = g1SortedStops.every((id, index) => {
      const g1Stop = g1SortedStops[index];
      const g2Stop = g2SortedStops[index];
      const stopColorsMatch = colorsMatch(g1Stop.color, g2Stop.color);
      const stopPositionsMatch = g1Stop.position === g2Stop.position;
      return stopColorsMatch && stopPositionsMatch;
    });
  }
  return gradientTypesMatch && originsMatch && destinationsMatch && stopsMatch;
};

export const getPaperProp = (prop: 'fill' | 'stroke'): 'fillColor' | 'strokeColor' => {
  switch(prop) {
    case 'fill':
      return 'fillColor';
    case 'stroke':
      return 'strokeColor';
  }
};

export const getArtboardsTopTop = (state: LayerState): number => {
  const artboards = state.allArtboardIds;
  return artboards.reduce((result: number, current: string) => {
    const layerItem = state.byId[current];
    if ((layerItem.frame.y - (layerItem.frame.height / 2)) < result) {
      result = layerItem.frame.y - (layerItem.frame.height / 2);
    }
    return result;
  }, state.byId[artboards[0]].frame.y - (state.byId[artboards[0]].frame.height / 2));
};

export const canUngroupLayers = (store: LayerState, layers: string[]): boolean => {
  return layers && layers.length > 0 && layers.some((id: string) => {
    const layer = store.byId[id];
    return layer.type === 'Group';
  });
};

export const canUngroupSelection = (store: LayerState): boolean => {
  return canUngroupLayers(store, store.selected);
};

export const canMaskLayers = (store: LayerState, layers: string[]): boolean => {
  const layersByDepth = layers && layers.length > 0 ? orderLayersByDepth(store, layers) : [];
  return layers &&
         layers.length > 0 &&
         layers.every((id: string) => store.byId[id].type !== 'Artboard') &&
         store.byId[layersByDepth[0]].type === 'Shape' &&
         (store.byId[layersByDepth[0]] as Btwx.Shape).shapeType !== 'Line' &&
         !(store.byId[layersByDepth[0]] as Btwx.Shape).mask
};

export const canMaskSelection = (store: LayerState): boolean => {
  return canMaskLayers(store, store.selected);
};

export const canResizeSelection = (store: LayerState): boolean => {
  const selectedWithChildren = store.selected.reduce((result: { allIds: string[]; byId: { [id: string]: Btwx.Layer } }, current) => {
    const layerAndChildren = getLayerAndDescendants(store, current);
    result.allIds = [...result.allIds, ...layerAndChildren];
    layerAndChildren.forEach((id) => {
      result.byId[id] = store.byId[id];
    });
    return result;
  }, { allIds: [], byId: {} });
  return store.selected.length >= 1 && !store.selected.some((id) => store.byId[id].type === 'Artboard') && selectedWithChildren.allIds.some((id) => store.byId[id].type === 'Text' || store.byId[id].type === 'Group');
};

export const canPasteSVG = (): boolean => {
  try {
    const clipboardText = clipboard.readText();
    return isSVG(clipboardText);
  } catch(error) {
    return false;
  }
};