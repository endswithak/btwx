/* eslint-disable @typescript-eslint/no-use-before-define */
import paper from 'paper';
import { LayerState } from '../reducers/layer';
import { paperMain } from '../../canvas';
import { bufferToBase64 } from '../../utils';
import { applyShapeMethods } from '../../canvas/shapeUtils';
import { applyCompoundShapeMethods } from '../../canvas/compoundShapeUtils';
import { applyArtboardMethods } from '../../canvas/artboardUtils';
import { applyTextMethods } from '../../canvas/textUtils';
import { applyImageMethods } from '../../canvas/imageUtils';

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

export const getLayerDescendants = (state: LayerState, layer: string, fromClipboard?: boolean): string[] => {
  const groups: string[] = [layer];
  const layers: string[] = [];
  let i = 0;
  while(i < groups.length) {
    const layer = fromClipboard ? state.clipboard.byId[groups[i]] : state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = fromClipboard ? state.clipboard.byId[child] : state.byId[child];
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

export const getLayerAndDescendants = (state: LayerState, layer: string, fromClipboard?: boolean): string[] => {
  const children = getLayerDescendants(state, layer, fromClipboard);
  return [layer, ...children];
};

export const getLayerDepth = (store: LayerState, id: string) => {
  let depth = 0;
  let currentNode = getParentLayer(store, id);
  while(currentNode.type === 'Group' || currentNode.type === 'Artboard' || currentNode.type === 'CompoundShape') {
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
    if (layer.type === 'Group' || layer.type === 'Artboard' || layer.type === 'CompoundShape') {
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
  while(parent.type === 'Group' || parent.type === 'Artboard' || parent.type === 'CompoundShape') {
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

export const getSelectionTopLeft = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    if (useLayerItem) {
      const layerItem = store.byId[current];
      const topLeft = new paperMain.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
      return [...result, topLeft];
    } else {
      const paperLayer = getPaperLayer(current);
      return [...result, paperLayer.bounds.topLeft];
    }
  }, []);
  return paperLayerPoints.length > 0 ? paperLayerPoints.reduce(paper.Point.min) : null;
}

export const getSelectionBottomRight = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.selected.reduce((result, current) => {
    if (useLayerItem) {
      const layerItem = store.byId[current];
      const bottomRight = new paperMain.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
      return [...result, bottomRight];
    } else {
      const paperLayer = getPaperLayer(current);
      return [...result, paperLayer.bounds.bottomRight];
    }
  }, []);
  return paperLayerPoints.length > 0 ? paperLayerPoints.reduce(paper.Point.max) : null;
}

export const getSelectionBounds = (store: LayerState, useLayerItem?: boolean): paper.Rectangle => {
  const topLeft = getSelectionTopLeft(store, useLayerItem);
  const bottomRight = getSelectionBottomRight(store, useLayerItem);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
}

export const getSelectionCenter = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const topLeft = getSelectionTopLeft(store, useLayerItem);
  const bottomRight = getSelectionBottomRight(store, useLayerItem);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
}

export const getCanvasTopLeft = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.allIds.reduce((result, current) => {
    if (current !== 'page') {
      if (useLayerItem) {
        const layerItem = store.byId[current];
        const topLeft = new paperMain.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
        return [...result, topLeft];
      } else {
        const paperLayer = getPaperLayer(current);
        return [...result, paperLayer.bounds.topLeft];
      }
    } else {
      return result;
    }
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getCanvasBottomRight = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.allIds.reduce((result, current) => {
    if (current !== 'page') {
      if (useLayerItem) {
        const layerItem = store.byId[current];
        const bottomRight = new paperMain.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
        return [...result, bottomRight];
      } else {
        const paperLayer = getPaperLayer(current);
        return [...result, paperLayer.bounds.bottomRight];
      }
    } else {
      return result;
    }
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getCanvasBounds = (store: LayerState, useLayerItem?: boolean): paper.Rectangle => {
  const topLeft = getCanvasTopLeft(store, useLayerItem);
  const bottomRight = getCanvasBottomRight(store, useLayerItem);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
}

export const getCanvasCenter = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const topLeft = getCanvasTopLeft(store, useLayerItem);
  const bottomRight = getCanvasBottomRight(store, useLayerItem);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
}

export const getClipboardTopLeft = (store: LayerState, canvasImages: {[id: string]: em.CanvasImage}): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const layerItem = store.clipboard.byId[current];
    let paperLayerJSON = layerItem.paperLayer;
    if (layerItem.type === 'Image') {
      const buffer = Buffer.from(canvasImages[layerItem.imageId].buffer);
      const base64 = `data:image/webp;base64,${bufferToBase64(buffer)}`;
      paperLayerJSON = paperLayerJSON.replace(`"source":"${layerItem.imageId}"`, `"source":"${base64}"`);
    }
    const paperLayer = paperMain.project.importJSON(paperLayerJSON);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
}

export const getClipboardBottomRight = (store: LayerState, canvasImages: {[id: string]: em.CanvasImage}): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const layerItem = store.clipboard.byId[current];
    let paperLayerJSON = layerItem.paperLayer;
    if (layerItem.type === 'Image') {
      const buffer = Buffer.from(canvasImages[layerItem.imageId].buffer);
      const base64 = `data:image/webp;base64,${bufferToBase64(buffer)}`;
      paperLayerJSON = paperLayerJSON.replace(`"source":"${layerItem.imageId}"`, `"source":"${base64}"`);
    }
    const paperLayer = paperMain.project.importJSON(paperLayerJSON);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
}

export const getClipboardCenter = (store: LayerState, canvasImages: {[id: string]: em.CanvasImage}): paper.Point => {
  const topLeft = getClipboardTopLeft(store, canvasImages);
  const bottomRight = getClipboardBottomRight(store, canvasImages);
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
    image: false,
    shape: false,
    fill: false,
    x: false,
    y: false,
    rotation: false,
    width: false,
    height: false,
    stroke: false,
    strokeDashWidth: false,
    strokeDashGap: false,
    strokeWidth: false,
    shadowColor: false,
    shadowOffsetX: false,
    shadowOffsetY: false,
    shadowBlur: false,
    opacity: false,
    fontSize: false,
    lineHeight: false
  }
  Object.keys(tweenPropMap).forEach((key: em.TweenProp) => {
    switch(key) {
      case 'image':
        if (
          layer.data.type === 'Image' &&
          equivalent.data.type === 'Image' &&
          layer.data.imageId !== equivalent.data.imageId
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shape':
        if (
          layer.data.type !== 'ArtboardBackground' &&
          layer.className === 'Path' &&
          equivalent.className === 'Path'
        ) {
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
      case 'x':
        if (
          (layer.data.type === 'Text' && equivalent.data.type === 'Text' && ((layer as paper.PointText).fontSize !== (equivalent as paper.PointText).fontSize || (layer as paper.PointText).leading !== (equivalent as paper.PointText).leading)) ||
          layerArtboardPosition.x !== equivalentArtboardPosition.x &&
          layer.data.type !== 'ArtboardBackground'
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'y':
        if (
          (layer.data.type === 'Text' && equivalent.data.type === 'Text' && ((layer as paper.PointText).fontSize !== (equivalent as paper.PointText).fontSize || (layer as paper.PointText).leading !== (equivalent as paper.PointText).leading)) ||
          layerArtboardPosition.y !== equivalentArtboardPosition.y &&
          layer.data.type !== 'ArtboardBackground'
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'rotation':
        if (
          layer.rotation !== equivalent.rotation &&
          layer.data.type !== 'ArtboardBackground'
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'width':
        if (
          layer.bounds.width !== equivalent.bounds.width &&
          layer.data.type !== 'ArtboardBackground' &&
          layer.data.type !== 'Text'
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'height':
        if (
          layer.bounds.height !== equivalent.bounds.height &&
          layer.data.type !== 'ArtboardBackground' &&
          layer.data.type !== 'Text'
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'stroke':
        if (
          (!layer.strokeColor && equivalent.strokeColor) ||
          (layer.strokeColor && !equivalent.strokeColor) ||
          (layer.strokeColor && equivalent.strokeColor && !layer.strokeColor.equals(equivalent.strokeColor)) ||
          (layer.strokeColor && layer.strokeColor.type === 'gradient' && equivalent.strokeColor && equivalent.strokeColor.type === 'rgb') ||
          (layer.strokeColor && layer.strokeColor.type === 'rgb' && equivalent.strokeColor && equivalent.strokeColor.type === 'gradient') ||
          (layer.strokeColor && layer.strokeColor.type === 'gradient' && equivalent.strokeColor && equivalent.strokeColor.type === 'gradient' && !layer.strokeColor.gradient.equals(equivalent.strokeColor.gradient))
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'strokeDashWidth':
        if (layer.dashArray[0] !== equivalent.dashArray[0]) {
          tweenPropMap[key] = true;
        }
        break;
      case 'strokeDashGap':
        if (layer.dashArray[1] !== equivalent.dashArray[1]) {
          tweenPropMap[key] = true;
        }
        break;
      case 'strokeWidth':
        if (layer.strokeWidth !== equivalent.strokeWidth) {
          tweenPropMap[key] = true;
        }
        break;
      case 'shadowColor':
        if (
          (!layer.shadowColor && equivalent.shadowColor) ||
          (layer.shadowColor && !equivalent.shadowColor) ||
          (layer.shadowColor && equivalent.shadowColor && !layer.shadowColor.equals(equivalent.shadowColor))
        ) {
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
        if (
          layer.className === 'PointText' &&
          equivalent.className === 'PointText' &&
          (layer as paper.PointText).fontSize !== (equivalent as paper.PointText).fontSize
        ) {
          tweenPropMap[key] = true;
        }
        break;
      case 'lineHeight':
        if (
          layer.className === 'PointText' &&
          equivalent.className === 'PointText' &&
          (layer as paper.PointText).leading !== (equivalent as paper.PointText).leading
        ) {
          tweenPropMap[key] = true;
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

export const getGradientStops = (stops: { [id: string]: em.GradientStop }): paper.GradientStop[] => {
  return Object.keys(stops).reduce((result, current) => {
    const stop = stops[current];
    result = [
      ...result,
      new paperMain.GradientStop({ hue: stop.color.h, saturation: stop.color.s, lightness: stop.color.l, alpha: stop.color.a } as paper.Color, stop.position)
    ];
    return result;
  }, []);
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

export const exportPaperProject = (state: LayerState): string => {
  const selectionFrame = paperMain.project.getItem({data: {id: 'selectionFrame'}});
  const hoverFrame = paperMain.project.getItem({data: {id: 'hoverFrame'}});
  const gradientFrame = paperMain.project.getItem({data: {id: 'gradientFrame'}});
  const activeArtboardFrame = paperMain.project.getItem({data: {id: 'activeArtboard'}});
  if (selectionFrame) {
    selectionFrame.remove();
  }
  if (hoverFrame) {
    hoverFrame.remove();
  }
  if (gradientFrame) {
    gradientFrame.remove();
  }
  if (activeArtboardFrame) {
    activeArtboardFrame.remove();
  }
  const projectJSON = paperMain.project.exportJSON();
  const canvasImageBase64ById = state.allImageIds.reduce((result: { [id: string]: string }, current) => {
    const layer = state.byId[current] as em.Image;
    const paperLayer = getPaperLayer(current).getItem({data: {id: 'Raster'}}) as paper.Raster;
    result[layer.imageId] = paperLayer.source as string;
    return result;
  }, {});
  return Object.keys(canvasImageBase64ById).reduce((result, current) => {
    result = result.replace(canvasImageBase64ById[current], current);
    return result;
  }, projectJSON);
}

interface ImportPaperProject {
  canvasImages: {
    [id: string]: em.CanvasImage;
  };
  paperProject: string;
  layers: {
    shape: string[];
    artboard: string[];
    text: string[];
    image: string[];
  };
}

export const importPaperProject = ({canvasImages, paperProject, layers}: ImportPaperProject): void => {
  paperMain.project.clear();
  const newPaperProject = Object.keys(canvasImages).reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(canvasImages[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, paperProject);
  paperMain.project.importJSON(newPaperProject);
  layers.shape.forEach((shapeId) => {
    applyShapeMethods(getPaperLayer(shapeId));
  });
  layers.artboard.forEach((artboardId) => {
    const artboardBackground = getPaperLayer(artboardId).getItem({data: {id: 'ArtboardBackground'}});
    applyArtboardMethods(artboardBackground);
  });
  layers.text.forEach((textId) => {
    applyTextMethods(getPaperLayer(textId));
  });
  layers.image.forEach((imageId) => {
    const raster = getPaperLayer(imageId).getItem({data: {id: 'Raster'}});
    applyImageMethods(raster);
  });
}

export const colorsMatch = (color1: em.Color, color2: em.Color) => {
  return Object.keys(color1).every((prop: 'h' | 's' | 'l' | 'v' | 'a') => color1[prop] === color2[prop]);
}

export const gradientsMatch = (gradient1: em.Gradient, gradient2: em.Gradient) => {
  const gradientTypesMatch = gradient1.gradientType === gradient2.gradientType;
  const originsMatch = gradient1.origin.x === gradient2.origin.x && gradient1.origin.y === gradient2.origin.y;
  const destinationsMatch = gradient1.destination.x === gradient2.destination.x && gradient1.destination.y === gradient2.destination.y;
  const g1SortedStops = [...gradient1.stops.allIds].sort((a,b) => { return gradient1.stops.byId[a].position - gradient1.stops.byId[b].position });
  const g2SortedStops = [...gradient2.stops.allIds].sort((a,b) => { return gradient2.stops.byId[a].position - gradient2.stops.byId[b].position });
  const stopsMatch = g1SortedStops.every((id, index) => {
    const g1Stop = gradient1.stops.byId[g1SortedStops[index]];
    const g2Stop = gradient2.stops.byId[g2SortedStops[index]];
    const stopColorsMatch = colorsMatch(g1Stop.color, g2Stop.color);
    const stopPositionsMatch = g1Stop.position === g2Stop.position;
    return stopColorsMatch && stopPositionsMatch;
  });
  return gradientTypesMatch && originsMatch && destinationsMatch && stopsMatch;
}