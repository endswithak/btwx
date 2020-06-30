import paper from 'paper';
import { LayerState } from '../reducers/layer';
import { paperMain } from '../../canvas';

export const getLayer = (store: LayerState, id: string): em.Layer => {
  return store.byId[id] as em.Layer;
}

export const getParentLayer = (store: LayerState, id: string): em.Group => {
  const layer = getLayer(store, id);
  return store.byId[layer.parent] as em.Group;
}

export const getLayerIndex = (store: LayerState, id: string): number => {
  const parent = getParentLayer(store, id);
  return parent.children.indexOf(id);
}

export const getLayerType = (store: LayerState, id: string): em.LayerType => {
  const layer = getLayer(store, id);
  return layer.type;
}

export const getPaperLayerByPaperId = (id: string): paper.Item => {
  return paperMain.project.getItem({ data: { id } });
}

export const getPaperLayer = (id: string): paper.Item => {
  return paperMain.project.getItem({ data: { id } });
}

export const getPage = (store: LayerState): em.Page => {
  return store.byId[store.page] as em.Page;
}

export const getPagePaperLayer = (store: LayerState): paper.Item => {
  const page = store.page;
  return getPaperLayer(page);
}

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

export const getLayerDepth = (store: LayerState, id: string) => {
  let depth = 0;
  let currentNode = getParentLayer(store, id);
  while(currentNode.type === 'Group' || currentNode.type === 'Artboard') {
    currentNode = getParentLayer(store, currentNode.id);
    depth++;
  }
  return depth;
}

export const getScopeLayers = (store: LayerState) => {
  const rootItems = getPage(store).children;
  const expandedItems = store.scope.reduce((result, current) => {
    const layer = getLayer(store, current);
    result = [...result, ...layer.children];
    return result;
  }, []);
  return [...rootItems, ...expandedItems];
}

export const getScopeGroupLayers = (store: LayerState) => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.reduce((result, current) => {
    const layer = getLayer(store, current);
    if (layer.type === 'Group' || layer.type === 'Artboard') {
      result = [...result, current];
    }
    return result;
  }, []);
}

export const isScopeLayer = (store: LayerState, id: string) => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.includes(id);
}

export const isScopeGroupLayer = (store: LayerState, id: string) => {
  const expandableLayers = getScopeGroupLayers(store);
  return expandableLayers.includes(id);
}

export const getNearestScopeAncestor = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  while(!isScopeLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
}

export const getNearestScopeGroupAncestor = (store: LayerState, id: string) => {
  let currentNode = getLayer(store, id);
  while(!isScopeGroupLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
}

export const getLayerScope = (store: LayerState, id: string) => {
  const newScope = [];
  let parent = getParentLayer(store, id);
  while(parent.type === 'Group' || parent.type === 'Artboard') {
    newScope.push(parent.id);
    parent = getParentLayer(store, parent.id);
  }
  return newScope.reverse();
}

export const getLayersTopLeft = (layers: string[]): paper.Point => {
  const paperLayerPoints = layers.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getLayersBottomRight = (layers: string[]): paper.Point => {
  const paperLayerPoints = layers.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getLayersBounds = (layers: string[]): paper.Rectangle => {
  const topLeft = getLayersTopLeft(layers);
  const bottomRight = getLayersBottomRight(layers);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
}

export const getSelectionTopLeft = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getSelectionBottomRight = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getSelectionBounds = (store: LayerState): paper.Rectangle => {
  const topLeft = getSelectionTopLeft(store);
  const bottomRight = getSelectionBottomRight(store);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
}

export const getSelectionCenter = (store: LayerState): paper.Point => {
  const topLeft = getSelectionTopLeft(store);
  const bottomRight = getSelectionBottomRight(store);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
}

export const getClipboardTopLeft = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const paperLayer = paperMain.project.importJSON(store.clipboard.byId[current].paperLayer);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getClipboardBottomRight = (store: LayerState): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const paperLayer = paperMain.project.importJSON(store.clipboard.byId[current].paperLayer);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getClipboardCenter = (store: LayerState): paper.Point => {
  const topLeft = getClipboardTopLeft(store);
  const bottomRight = getClipboardBottomRight(store);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
}

export const getDestinationEquivalent = (store: LayerState, layer: string, destinationChildren: string[]): em.Layer => {
  let equivalent = null;
  const layerItem = store.byId[layer];
  for(let i = 0; i < destinationChildren.length; i++) {
    const childLayer = store.byId[destinationChildren[i]];
    if (childLayer.name === layerItem.name && childLayer.type === layerItem.type) {
      equivalent = childLayer;
      break;
    }
  }
  return equivalent;
}

export const getPositionInArtboard = (layer: paper.Item, artboard: paper.Item): paper.Point => {
  const xDiff = artboard.position.x - layer.position.x;
  const yDiff = artboard.position.y - layer.position.y;
  return new paper.Point(xDiff, yDiff);
}

export const getEquivalentTweenProps = (layer: paper.Item, equivalent: paper.Item, artboard: paper.Item, destinationArtboard: paper.Item): em.TweenPropMap => {
  const layerArtboardPosition = getPositionInArtboard(layer, artboard);
  const equivalentArtboardPosition = getPositionInArtboard(equivalent, destinationArtboard);
  const tweenPropMap: em.TweenPropMap = {
    shape: false,
    fill: false,
    //fillGradient: false,
    x: false,
    y: false,
    rotation: false,
    width: false,
    height: false,
    stroke: false,
    strokeWidth: false,
    shadowColor: false,
    shadowOffsetX: false,
    shadowOffsetY: false,
    shadowBlur: false,
    opacity: false,
    fontSize: false
  }
  Object.keys(tweenPropMap).forEach((key: em.TweenProp) => {
    switch(key) {
      case 'shape':
        if (layer.data.type !== 'ArtboardBackground' && layer.className === 'Path' && equivalent.className === 'Path') {
          const equivalentShapeTest = equivalent.clone({insert: false});
          equivalentShapeTest.position = layer.position;
          if (!(layer as paper.Path).compare(equivalentShapeTest as paper.Path)) {
            tweenPropMap[key] = true;
          }
        }
        break;
      case 'fill':
        if (
          (!layer.fillColor && equivalent.fillColor) ||
          (layer.fillColor && !equivalent.fillColor) ||
          (layer.fillColor && equivalent.fillColor && !layer.fillColor.equals(equivalent.fillColor)) ||
          (layer.fillColor && layer.fillColor.type === 'gradient' && equivalent.fillColor && equivalent.fillColor.type === 'rgb') ||
          (layer.fillColor && layer.fillColor.type === 'rgb' && equivalent.fillColor && equivalent.fillColor.type === 'gradient') ||
          (layer.fillColor && layer.fillColor.type === 'gradient' && equivalent.fillColor && equivalent.fillColor.type === 'gradient' && !layer.fillColor.gradient.equals(equivalent.fillColor.gradient))
        ) {
          tweenPropMap[key] = true;
        }
        break;
      // case 'fillColor':
      //   if (layer.fillColor && layer.fillColor.type !== 'gradient' && equivalent.fillColor && !layer.fillColor.equals(equivalent.fillColor)) {
      //     tweenPropMap[key] = true;
      //   } else if (!layer.fillColor && equivalent.fillColor) {
      //     tweenPropMap[key] = true;
      //   }
      //   break;
      // case 'fillGradient':
      //   if (layer.fillColor && layer.fillColor.type === 'gradient' && equivalent.fillColor.type === 'gradient' && !layer.fillColor.gradient.equals(equivalent.fillColor.gradient)) {
      //     tweenPropMap[key] = true;
      //   } else if (!layer.fillColor && equivalent.fillColor) {
      //     tweenPropMap[key] = true;
      //   }
      //   break;
      case 'x':
        if (layerArtboardPosition.x !== equivalentArtboardPosition.x && layer.data.type !== 'ArtboardBackground') {
          tweenPropMap[key] = true;
        }
        break;
      case 'y':
        if (layerArtboardPosition.y !== equivalentArtboardPosition.y && layer.data.type !== 'ArtboardBackground') {
          tweenPropMap[key] = true;
        }
        break;
      case 'rotation':
        if (layer.rotation !== equivalent.rotation && layer.data.type !== 'ArtboardBackground') {
          tweenPropMap[key] = true;
        }
        break;
      case 'width':
        if (layer.bounds.width !== equivalent.bounds.width && layer.data.type !== 'ArtboardBackground' && layer.data.type !== 'Text') {
          tweenPropMap[key] = true;
        }
        break;
      case 'height':
        if (layer.bounds.height !== equivalent.bounds.height && layer.data.type !== 'ArtboardBackground' && layer.data.type !== 'Text') {
          tweenPropMap[key] = true;
        }
        break;
      // case 'strokeColor':
      //   if (layer.strokeColor && equivalent.strokeColor && !layer.strokeColor.equals(equivalent.strokeColor)) {
      //     tweenPropMap[key] = true;
      //   } else if (!layer.strokeColor && equivalent.strokeColor) {
      //     tweenPropMap[key] = true;
      //   }
      //   break;
      case 'strokeWidth':
        if (layer.strokeWidth !== equivalent.strokeWidth) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shadowColor':
        if (layer.shadowColor && equivalent.shadowColor && !layer.shadowColor.equals(equivalent.shadowColor)) {
          tweenPropMap[key] = true;
        } else if (!layer.shadowColor && equivalent.shadowColor) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shadowOffsetX':
        if (layer.shadowOffset.x !== equivalent.shadowOffset.x) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shadowOffsetY':
        if (layer.shadowOffset.y !== equivalent.shadowOffset.y) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shadowBlur':
        if (layer.shadowBlur !== equivalent.shadowBlur) {
          tweenPropMap[key] = true;
        }
        break;
      case 'opacity':
        if (layer.opacity !== equivalent.opacity) {
          tweenPropMap[key] = true;
        }
        break;
      case 'fontSize':
        if (layer.className === 'PointText' && equivalent.className === 'PointText') {
          if ((layer as paper.PointText).fontSize !== (equivalent as paper.PointText).fontSize) {
            tweenPropMap[key] = true;
          }
        }
        break;
    }
  });
  return tweenPropMap;
}

export const getLongestEventTween = (tweensById: {[id: string]: em.Tween}): em.Tween => {
  return Object.keys(tweensById).reduce((result: em.Tween, current: string) => {
    if (tweensById[current].duration + tweensById[current].delay >= result.duration + result.delay) {
      return tweensById[current];
    } else {
      return result;
    }
  }, tweensById[Object.keys(tweensById)[0]]);
}

export const isTweenDestinationLayer = (store: LayerState, layer: string): boolean => {
  const layerItem = getLayer(store, layer);
  const layerTweens = layerItem.tweens;
  return layerTweens.length > 0 && layerTweens.some((tween) => store.tweenById[tween].destinationLayer === layer);
}

export const getAllArtboardTweenEvents = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.TweenEvent } } => {
  const allIds: string[] = [];
  const byId = Object.keys(store.tweenEventById).reduce((result: {[id: string]: em.TweenEvent}, current) => {
    if (store.tweenEventById[current].artboard === artboard) {
      result[current] = store.tweenEventById[current];
      allIds.push(current);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getAllArtboardTweenEventDestinations = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Artboard } } => {
  const allArtboardAnimationEvents = getAllArtboardTweenEvents(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardAnimationEvents.byId).reduce((result: { [id: string]: em.Artboard }, current) => {
    const event = allArtboardAnimationEvents.byId[current];
    if (!allIds.includes(event.destinationArtboard)) {
      result[event.destinationArtboard] = store.byId[event.destinationArtboard] as em.Artboard;
      allIds.push(event.destinationArtboard);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getAllArtboardTweenEventLayers = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Layer } } => {
  const allArtboardAnimationEvents = getAllArtboardTweenEvents(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardAnimationEvents.byId).reduce((result: { [id: string]: em.Layer }, current) => {
    const event = allArtboardAnimationEvents.byId[current];
    if (!allIds.includes(event.layer)) {
      result[event.layer] = store.byId[event.layer] as em.Artboard;
      allIds.push(event.layer);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getAllArtboardTweens = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const allArtboardAnimationEvents = getAllArtboardTweenEvents(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardAnimationEvents.byId).reduce((result: { [id: string]: em.Tween }, current) => {
    const event = allArtboardAnimationEvents.byId[current];
    event.tweens.forEach((tween) => {
      result[tween] = store.tweenById[tween];
      allIds.push(tween);
    });
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getAllArtboardTweenLayers = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Layer } } => {
  const allArtboardTweens = getAllArtboardTweens(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardTweens.byId).reduce((result: { [id: string]: em.Layer }, current) => {
    const layerId = allArtboardTweens.byId[current].layer;
    if (!allIds.includes(layerId)) {
      result[layerId] = store.byId[layerId];
      allIds.push(layerId);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getAllArtboardTweenLayerDestinations = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Layer } } => {
  const allArtboardTweens = getAllArtboardTweens(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardTweens.byId).reduce((result: { [id: string]: em.Layer }, current) => {
    const layerId = allArtboardTweens.byId[current].destinationLayer;
    if (!allIds.includes(layerId)) {
      result[layerId] = store.byId[layerId];
      allIds.push(layerId);
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getTweenEventLayers = (store: LayerState, eventId: string): { allIds: string[]; byId: { [id: string]: em.Layer } } => {
  const tweenEvent = store.tweenEventById[eventId];
  const allIds: string[] = [];
  const byId = tweenEvent.tweens.reduce((result: { [id: string]: em.Layer }, current) => {
    const tween = store.tweenById[current];
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

export const getTweenEventLayerTweens = (store: LayerState, eventId: string, layerId: string): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const tweenEvent = store.tweenEventById[eventId];
  const allIds: string[] = [];
  const byId = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current) => {
    const tween = store.tweenById[current];
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

export const getTweensByDestinationLayer = (store: LayerState, layerId: string): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const allIds: string[] = [];
  const byId = Object.keys(store.tweenById).reduce((result: { [id: string]: em.Tween }, current) => {
    const tween = store.tweenById[current];
    if (tween.destinationLayer === layerId) {
      allIds.push(current);
      result[current] = tween;
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getTweensByLayer = (store: LayerState, layerId: string): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const allIds: string[] = [];
  const byId = Object.keys(store.tweenById).reduce((result: { [id: string]: em.Tween }, current) => {
    const tween = store.tweenById[current];
    if (tween.layer === layerId) {
      allIds.push(current);
      result[current] = tween;
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getTweensEventsByDestinationArtboard = (store: LayerState, artboardId: string): { allIds: string[]; byId: { [id: string]: em.TweenEvent } } => {
  const allIds: string[] = [];
  const byId = Object.keys(store.tweenEventById).reduce((result: { [id: string]: em.TweenEvent }, current) => {
    const tweenEvent = store.tweenEventById[current];
    if (tweenEvent.destinationArtboard === artboardId) {
      allIds.push(current);
      result[current] = tweenEvent;
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  };
};

export const getGradientOriginPoint = (id: string, origin: em.Point): paper.Point => {
  const paperLayer = getPaperLayer(id);
  return new paperMain.Point((origin.x * paperLayer.bounds.width) + paperLayer.position.x, (origin.y * paperLayer.bounds.height) + paperLayer.position.y);
};

export const getGradientDestinationPoint = (id: string, destination: em.Point): paper.Point => {
  const paperLayer = getPaperLayer(id);
  return new paperMain.Point((destination.x * paperLayer.bounds.width) + paperLayer.position.x, (destination.y * paperLayer.bounds.height) + paperLayer.position.y);
};

export const getGradientStops = (stops: em.GradientStop[]): paper.GradientStop[] => {
  return stops.map((stop) => {
    return new paperMain.GradientStop(new paperMain.Color(stop.color), stop.position);
  });
};

export const getLayerSnapPoints = (id: string): em.SnapPoint[] => {
  const paperLayer = getPaperLayer(id);
  let bounds;
  if (paperLayer.data.type === 'Artboard') {
    bounds = paperLayer.getItem({data: { id: 'ArtboardBackground' }}).bounds;
  } else {
    bounds = paperLayer.bounds;
  }
  const left = {
    id: id,
    axis: 'x',
    side: 'left',
    point: bounds.left
  } as em.SnapPoint;
  const centerX = {
    id: id,
    axis: 'x',
    side: 'center',
    point: bounds.center.x
  } as em.SnapPoint;
  const centerY = {
    id: id,
    axis: 'y',
    side: 'center',
    point: bounds.center.y
  } as em.SnapPoint;
  const right = {
    id: id,
    axis: 'x',
    side: 'right',
    point: bounds.right
  } as em.SnapPoint;
  const top = {
    id: id,
    axis: 'y',
    side: 'top',
    point: bounds.top
  } as em.SnapPoint;
  const bottom = {
    id: id,
    axis: 'y',
    side: 'bottom',
    point: bounds.bottom
  } as em.SnapPoint;
  return [left, right, top, bottom, centerX, centerY];
}

export const getInViewSnapPoints = (state: LayerState): em.SnapPoint[] => {
  return state.inView.allIds.reduce((result, current) => {
    const snapPoints = getLayerSnapPoints(current);
    result = [...result, ...snapPoints];
    return result;
  }, []);
};

export const orderLayersByDepth = (state: LayerState, layers: string[]): string[] => {
  const ordered: string[] = [];
  while(ordered.length !== layers.length) {
    const filtered = layers.filter((id) => !ordered.includes(id));
    const topLayer = filtered.reduce((result, current) => {
      const layerDepth = getLayerDepth(state, current);
      const layerIndex = getLayerIndex(state, current);
      if (layerDepth < result.depth) {
        return {
          id: current,
          index: layerIndex,
          depth: layerDepth
        }
      } else if (layerDepth === result.depth) {
        if (layerIndex > result.index) {
          return {
            id: current,
            index: layerIndex,
            depth: layerDepth
          }
        } else {
          return result;
        }
      } else {
        return result;
      }
    }, {
      id: filtered[0],
      index: getLayerIndex(state, filtered[0]),
      depth: getLayerDepth(state, filtered[0])
    });
    ordered.unshift(topLayer.id);
  }
  return ordered;
}

export const orderLayersByLeft = (layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aPaperLayer = getPaperLayer(a);
    const bPaperLayer = getPaperLayer(b);
    return aPaperLayer.bounds.left - bPaperLayer.bounds.left;
  });
}

export const orderLayersByTop = (layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aPaperLayer = getPaperLayer(a);
    const bPaperLayer = getPaperLayer(b);
    return aPaperLayer.bounds.top - bPaperLayer.bounds.top;
  });
}

export const compareGradientStops = (s1: em.GradientStop[], s2: em.GradientStop[]): boolean => {
  return s1.length === s2.length &&
         s1.every((stop, index) => stop.color === s2[index].color) &&
         s1.every((stop, index) => stop.position === s2[index].position);
};

export const compareGradients = (g1: em.Gradient, g2: em.Gradient): boolean => {
  return compareGradientStops(g1.stops, g2.stops) &&
         g1.origin === g2.origin &&
         g1.destination === g2.destination &&
         g1.gradientType === g2.gradientType;
};

export const compareFills = (f1: em.Fill, f2: em.Fill): boolean => {
  return f1.fillType === f2.fillType &&
         f1.color === f2.color &&
         compareGradients(f1.gradient, f2.gradient);
};