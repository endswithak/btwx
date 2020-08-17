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
import { v4 as uuidv4 } from 'uuid';

export const getLayer = (store: LayerState, id: string): em.Layer => {
  return store.byId[id] as em.Layer;
};

export const getParentLayer = (store: LayerState, id: string): em.Group => {
  const layer = getLayer(store, id);
  return store.byId[layer.parent] as em.Group;
};

export const getLayerIndex = (store: LayerState, id: string): number => {
  const parent = getParentLayer(store, id);
  return parent.children.indexOf(id);
};

export const getLayerType = (store: LayerState, id: string): em.LayerType => {
  const layer = getLayer(store, id);
  return layer.type;
};

export const getPaperLayerByPaperId = (id: string): paper.Item => {
  return paperMain.project.getItem({ data: { id } });
};

export const getPaperLayer = (id: string): paper.Item => {
  return paperMain.project.getItem({ data: { id } });
};

export const getPage = (store: LayerState): em.Page => {
  return store.byId[store.page] as em.Page;
};

export const getPagePaperLayer = (store: LayerState): paper.Item => {
  const page = store.page;
  return getPaperLayer(page);
};

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
  const rootItems = getPage(store).children;
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
    if (layer.type === 'Group' || layer.type === 'Artboard' || layer.type === 'CompoundShape') {
      result = [...result, current];
    }
    return result;
  }, []);
};

export const isScopeLayer = (store: LayerState, id: string): boolean => {
  const expandedLayers = getScopeLayers(store);
  return expandedLayers.includes(id);
};

export const isScopeGroupLayer = (store: LayerState, id: string): boolean => {
  const expandableLayers = getScopeGroupLayers(store);
  return expandableLayers.includes(id);
};

export const getNearestScopeAncestor = (store: LayerState, id: string): em.Layer => {
  let currentNode = getLayer(store, id);
  while(!isScopeLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
};

export const getNearestScopeGroupAncestor = (store: LayerState, id: string): em.Layer => {
  let currentNode = getLayer(store, id);
  while(!isScopeGroupLayer(store, currentNode.id)) {
    currentNode = getParentLayer(store, currentNode.id);
  }
  return currentNode;
};

export const getLayerScope = (store: LayerState, id: string): string[] => {
  const newScope = [];
  let parent = getParentLayer(store, id);
  while(parent.type === 'Group' || parent.type === 'Artboard' || parent.type === 'CompoundShape') {
    newScope.push(parent.id);
    parent = getParentLayer(store, parent.id);
  }
  return newScope.reverse();
};

export const getLayersTopLeft = (store: LayerState, layers: string[]): paper.Point => {
  const paperLayerPoints = layers.reduce((result, current) => {
    const layerItem = store.byId[current];
    const topLeft = new paperMain.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
    return [...result, topLeft];
    //const paperLayer = getPaperLayer(current);
    //return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
};

export const getLayersBottomRight = (store: LayerState, layers: string[]): paper.Point => {
  const paperLayerPoints = layers.reduce((result, current) => {
    const layerItem = store.byId[current];
    const bottomRight = new paperMain.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
    return [...result, bottomRight];
    // const paperLayer = getPaperLayer(current);
    // return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
};

export const getLayersBounds = (store: LayerState, layers: string[]): paper.Rectangle => {
  const topLeft = getLayersTopLeft(store, layers);
  const bottomRight = getLayersBottomRight(store, layers);
  return new paperMain.Rectangle({
    from: topLeft,
    to: bottomRight
  });
};

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
};

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
};

export const getSelectionBounds = (store: LayerState, useLayerItem?: boolean): paper.Rectangle => {
  const topLeft = getSelectionTopLeft(store, useLayerItem);
  const bottomRight = getSelectionBottomRight(store, useLayerItem);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
};

export const getSelectionCenter = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const topLeft = getSelectionTopLeft(store, useLayerItem);
  const bottomRight = getSelectionBottomRight(store, useLayerItem);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
};

export const getCanvasTopLeft = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.allIds.reduce((result, current) => {
    if (current !== 'page') {
      if (useLayerItem) {
        const layerScope = getLayerScope(store, current);
        const layerItem = store.byId[current];
        if (!layerScope.some((id) => store.byId[id].type === 'Artboard') && !layerItem.masked) {
          const topLeft = new paperMain.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
          result = [...result, topLeft];
        }
        return result;
      } else {
        const paperLayer = getPaperLayer(current);
        return [...result, paperLayer.bounds.topLeft];
      }
    } else {
      return result;
    }
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
};

export const getCanvasBottomRight = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const paperLayerPoints = store.allIds.reduce((result, current) => {
    if (current !== 'page') {
      if (useLayerItem) {
        const layerScope = getLayerScope(store, current);
        const layerItem = store.byId[current];
        if (!layerScope.some((id) => store.byId[id].type === 'Artboard') && !layerItem.masked) {
          const bottomRight = new paperMain.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
          result = [...result, bottomRight];
        }
        return result;
      } else {
        const paperLayer = getPaperLayer(current);
        return [...result, paperLayer.bounds.bottomRight];
      }
    } else {
      return result;
    }
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
};

export const getCanvasBounds = (store: LayerState, useLayerItem?: boolean): paper.Rectangle => {
  const topLeft = getCanvasTopLeft(store, useLayerItem);
  const bottomRight = getCanvasBottomRight(store, useLayerItem);
  return new paper.Rectangle({
    from: topLeft,
    to: bottomRight
  });
};

export const getCanvasCenter = (store: LayerState, useLayerItem?: boolean): paper.Point => {
  const topLeft = getCanvasTopLeft(store, useLayerItem);
  const bottomRight = getCanvasBottomRight(store, useLayerItem);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
};

export const getClipboardTopLeft = (store: LayerState, documentImages: {[id: string]: em.DocumentImage}): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const layerItem = store.clipboard.byId[current];
    let paperLayerJSON = layerItem.paperLayer;
    if (layerItem.type === 'Image') {
      const buffer = Buffer.from(documentImages[layerItem.imageId].buffer);
      const base64 = `data:image/webp;base64,${bufferToBase64(buffer)}`;
      paperLayerJSON = paperLayerJSON.replace(`"source":"${layerItem.imageId}"`, `"source":"${base64}"`);
    }
    const paperLayer = paperMain.project.importJSON(paperLayerJSON);
    return [...result, paperLayer.bounds.topLeft];
  }, []);
  return paperLayerPoints.reduce(paper.Point.min);
};

export const getClipboardBottomRight = (store: LayerState, documentImages: {[id: string]: em.DocumentImage}): paper.Point => {
  const paperLayerPoints = store.clipboard.allIds.reduce((result, current) => {
    const layerItem = store.clipboard.byId[current];
    let paperLayerJSON = layerItem.paperLayer;
    if (layerItem.type === 'Image') {
      const buffer = Buffer.from(documentImages[layerItem.imageId].buffer);
      const base64 = `data:image/webp;base64,${bufferToBase64(buffer)}`;
      paperLayerJSON = paperLayerJSON.replace(`"source":"${layerItem.imageId}"`, `"source":"${base64}"`);
    }
    const paperLayer = paperMain.project.importJSON(paperLayerJSON);
    return [...result, paperLayer.bounds.bottomRight];
  }, []);
  return paperLayerPoints.reduce(paper.Point.max);
};

export const getClipboardCenter = (store: LayerState, documentImages: {[id: string]: em.DocumentImage}): paper.Point => {
  const topLeft = getClipboardTopLeft(store, documentImages);
  const bottomRight = getClipboardBottomRight(store, documentImages);
  const xMid = (topLeft.x + bottomRight.x) / 2;
  const yMid = (topLeft.y + bottomRight.y) / 2;
  return new paper.Point(xMid, yMid);
};

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
};

export const getPositionInArtboard = (layer: em.Layer, artboard: em.Artboard): paper.Point => {
  const xDiff = Math.round(layer.frame.x - (artboard.frame.x - (artboard.frame.width / 2)));
  const yDiff = Math.round(layer.frame.y - (artboard.frame.y - (artboard.frame.height / 2)));
  return new paper.Point(xDiff, yDiff);
};

export const hasImageTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    layerItem.type === 'Image' &&
    equivalentLayerItem.type === 'Image' &&
    (layerItem as em.Image).imageId !== (equivalentLayerItem as em.Image).imageId
  );
};

export const hasShapeTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    layerItem.type === 'Shape' &&
    equivalentLayerItem.type === 'Shape' &&
    (
      (layerItem as em.Shape).shapeType !== (equivalentLayerItem as em.Shape).shapeType ||
      (layerItem as em.Shape).shapeType === 'Polygon' && (equivalentLayerItem as em.Shape).shapeType === 'Polygon' && (layerItem as em.Polygon).sides !== (equivalentLayerItem as em.Polygon).sides ||
      (layerItem as em.Shape).shapeType === 'Star' && (equivalentLayerItem as em.Shape).shapeType === 'Star' && (layerItem as em.Star).points !== (equivalentLayerItem as em.Star).points
    )
  );
};

export const hasFillTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.style.fill.enabled || equivalentLayerItem.style.fill.enabled) &&
    (layerItem.type === 'Shape' || layerItem.type === 'Text') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text') &&
    (
      layerItem.style.fill.fillType !== equivalentLayerItem.style.fill.fillType ||
      layerItem.style.fill.fillType === 'color' && equivalentLayerItem.style.fill.fillType === 'color' && !colorsMatch(layerItem.style.fill.color, equivalentLayerItem.style.fill.color) ||
      layerItem.style.fill.fillType === 'gradient' && equivalentLayerItem.style.fill.fillType === 'gradient' && !gradientsMatch(layerItem.style.fill.gradient, equivalentLayerItem.style.fill.gradient)
    )
  );
};

export const hasXTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer, artboardLayerItem: em.Artboard, destinationArtboardLayerItem: em.Artboard): boolean => {
  const layerArtboardPosition = getPositionInArtboard(layerItem, artboardLayerItem);
  const equivalentArtboardPosition = getPositionInArtboard(equivalentLayerItem, destinationArtboardLayerItem);
  return (
    layerArtboardPosition.x !== equivalentArtboardPosition.x ||
    (
      layerItem.type === 'Text' &&
      equivalentLayerItem.type === 'Text' &&
      (
        (layerItem as em.Text).textStyle.fontSize !== (equivalentLayerItem as em.Text).textStyle.fontSize ||
        (layerItem as em.Text).textStyle.leading !== (equivalentLayerItem as em.Text).textStyle.leading
      )
    )
  );
};

export const hasYTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer, artboardLayerItem: em.Artboard, destinationArtboardLayerItem: em.Artboard): boolean => {
  const layerArtboardPosition = getPositionInArtboard(layerItem, artboardLayerItem);
  const equivalentArtboardPosition = getPositionInArtboard(equivalentLayerItem, destinationArtboardLayerItem);
  return (
    layerArtboardPosition.y !== equivalentArtboardPosition.y ||
    (
      layerItem.type === 'Text' &&
      equivalentLayerItem.type === 'Text' &&
      (
        (layerItem as em.Text).textStyle.fontSize !== (equivalentLayerItem as em.Text).textStyle.fontSize ||
        (layerItem as em.Text).textStyle.leading !== (equivalentLayerItem as em.Text).textStyle.leading
      )
    )
  );
};

export const hasRotationTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return layerItem.transform.rotation !== equivalentLayerItem.transform.rotation && !hasShapeTween(layerItem, equivalentLayerItem);
};

export const hasWidthTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  const lineToLine = layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Line' && equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as em.Shape).shapeType === 'Line';
  const layerItemValid = ((layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType !== 'Line') || layerItem.type === 'Image');
  const equivalentLayerItemValid = ((equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as em.Shape).shapeType !== 'Line') || equivalentLayerItem.type === 'Image');
  return (
    !hasShapeTween(layerItem, equivalentLayerItem) &&
    (lineToLine || (layerItemValid && equivalentLayerItemValid)) &&
    Math.round(layerItem.frame.innerWidth) !== Math.round(equivalentLayerItem.frame.innerWidth)
  );
};

export const hasHeightTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    !hasShapeTween(layerItem, equivalentLayerItem) &&
    ((layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType !== 'Line') || layerItem.type === 'Image') &&
    ((equivalentLayerItem.type === 'Shape' && (equivalentLayerItem as em.Shape).shapeType !== 'Line') || equivalentLayerItem.type === 'Image') &&
    Math.round(layerItem.frame.innerHeight) !== Math.round(equivalentLayerItem.frame.innerHeight)
  );
};

export const hasStrokeTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    (
      layerItem.style.stroke.fillType !== equivalentLayerItem.style.stroke.fillType ||
      layerItem.style.stroke.fillType === 'color' && equivalentLayerItem.style.stroke.fillType === 'color' && !colorsMatch(layerItem.style.stroke.color, equivalentLayerItem.style.stroke.color) ||
      layerItem.style.stroke.fillType === 'gradient' && equivalentLayerItem.style.stroke.fillType === 'gradient' && !gradientsMatch(layerItem.style.stroke.gradient, equivalentLayerItem.style.stroke.gradient)
    )
  );
};

export const hasDashOffsetTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashOffset !== equivalentLayerItem.style.strokeOptions.dashOffset
  );
};

export const hasDashArrayWidthTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashArray[0] !== equivalentLayerItem.style.strokeOptions.dashArray[0]
  );
};

export const hasDashArrayGapTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.strokeOptions.dashArray[1] !== equivalentLayerItem.style.strokeOptions.dashArray[1]
  );
};

export const hasStrokeWidthTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.stroke.enabled || equivalentLayerItem.style.stroke.enabled) &&
    layerItem.style.stroke.width !== equivalentLayerItem.style.stroke.width
  );
};

export const hasShadowColorTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.shadow.enabled || equivalentLayerItem.style.shadow.enabled) &&
    !colorsMatch(layerItem.style.shadow.color, equivalentLayerItem.style.shadow.color)
  );
};

export const hasShadowOffsetXTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.shadow.enabled || equivalentLayerItem.style.shadow.enabled) &&
    layerItem.style.shadow.offset.x !== equivalentLayerItem.style.shadow.offset.x
  );
};

export const hasShadowOffsetYTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.shadow.enabled || equivalentLayerItem.style.shadow.enabled) &&
    layerItem.style.shadow.offset.y !== equivalentLayerItem.style.shadow.offset.y
  );
};

export const hasShadowBlurTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    (layerItem.type === 'Shape' || layerItem.type === 'Text' || layerItem.type === 'Image') &&
    (equivalentLayerItem.type === 'Shape' || equivalentLayerItem.type === 'Text' || equivalentLayerItem.type === 'Image') &&
    (layerItem.style.shadow.enabled || equivalentLayerItem.style.shadow.enabled) &&
    layerItem.style.shadow.blur !== equivalentLayerItem.style.shadow.blur
  );
};

export const hasOpacityTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return layerItem.style.opacity !== equivalentLayerItem.style.opacity;
};

export const hasFontSizeTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    layerItem.type === 'Text' &&
    equivalentLayerItem.type === 'Text' &&
    (layerItem as em.Text).textStyle.fontSize !== (equivalentLayerItem as em.Text).textStyle.fontSize
  );
};

export const hasLineHeightTween = (layerItem: em.Layer, equivalentLayerItem: em.Layer): boolean => {
  return (
    layerItem.type === 'Text' &&
    equivalentLayerItem.type === 'Text' &&
    (layerItem as em.Text).textStyle.leading !== (equivalentLayerItem as em.Text).textStyle.leading
  );
};

export const getEquivalentTweenProp = (layerItem: em.Layer, equivalentLayerItem: em.Layer, artboardLayerItem: em.Artboard, destinationArtboardLayerItem: em.Artboard, prop: em.TweenProp): boolean => {
  switch(prop) {
    case 'image':
      return hasImageTween(layerItem, equivalentLayerItem);
    case 'shape':
      return hasShapeTween(layerItem, equivalentLayerItem);
    case 'fill':
      return hasFillTween(layerItem, equivalentLayerItem);
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
  }
};

export const getEquivalentTweenProps = (layerItem: em.Layer, equivalentLayerItem: em.Layer, artboardLayerItem: em.Artboard, destinationArtboardLayerItem: em.Artboard): em.TweenPropMap => ({
  image: hasImageTween(layerItem, equivalentLayerItem),
  shape: hasShapeTween(layerItem, equivalentLayerItem),
  fill: hasFillTween(layerItem, equivalentLayerItem),
  x: hasXTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem),
  y: hasYTween(layerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem),
  rotation: hasRotationTween(layerItem, equivalentLayerItem),
  radius: false,
  width: hasWidthTween(layerItem, equivalentLayerItem),
  height: hasHeightTween(layerItem, equivalentLayerItem),
  stroke: hasStrokeTween(layerItem, equivalentLayerItem),
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
  lineHeight: hasLineHeightTween(layerItem, equivalentLayerItem)
});

export const getLongestEventTween = (tweensById: {[id: string]: em.Tween}): em.Tween => {
  return Object.keys(tweensById).reduce((result: em.Tween, current: string) => {
    if (tweensById[current].duration + tweensById[current].delay >= result.duration + result.delay) {
      return tweensById[current];
    } else {
      return result;
    }
  }, tweensById[Object.keys(tweensById)[0]]);
};

export const isTweenDestinationLayer = (store: LayerState, layer: string): boolean => {
  const layerItem = getLayer(store, layer);
  const layerTweens = layerItem.tweens;
  return layerTweens.length > 0 && layerTweens.some((tween) => store.tweenById[tween].destinationLayer === layer);
};

export const getAllArtboardTweenEvents = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.TweenEvent } } => {
  const allIds: string[] = [];
  const byId = Object.keys(store.tweenEventById).reduce((result: {[id: string]: em.TweenEvent}, current) => {
    const tweenEvent = store.tweenEventById[current];
    if (tweenEvent.artboard === artboard) {
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

export const getAllArtboardTweenEventArtboards = (store: LayerState, artboard: string): { allIds: string[]; byId: { [id: string]: em.Artboard } } => {
  const allArtboardAnimationEvents = getAllArtboardTweenEvents(store, artboard);
  const allIds: string[] = [];
  const byId = Object.keys(allArtboardAnimationEvents.byId).reduce((result: { [id: string]: em.Artboard }, current) => {
    const event = allArtboardAnimationEvents.byId[current];
    if (!allIds.includes(event.destinationArtboard)) {
      result[event.destinationArtboard] = store.byId[event.destinationArtboard] as em.Artboard;
      allIds.push(event.destinationArtboard);
    }
    if (!allIds.includes(event.artboard)) {
      result[event.artboard] = store.byId[event.artboard] as em.Artboard;
      allIds.push(event.artboard);
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

export const getTweensByProp = (store: LayerState, layerId: string, prop: em.TweenProp): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const tweensByDestinationLayer = getTweensByDestinationLayer(store, layerId);
  const tweensByLayer = getTweensByLayer(store, layerId);
  const tweensByDestinationLayerAndProp = tweensByDestinationLayer.allIds.filter((id: string) => tweensByDestinationLayer.byId[id].prop === prop);
  const tweensByLayerAndProp = tweensByLayer.allIds.filter((id: string) => tweensByLayer.byId[id].prop === prop);
  const allIds = [...tweensByDestinationLayerAndProp, ...tweensByLayerAndProp];
  const byId = Object.keys({...tweensByDestinationLayer.byId, ...tweensByLayer.byId}).reduce((result: { [id: string]: em.Tween }, current) => {
    const tween = store.tweenById[current];
    if (allIds.includes(current)) {
      result[current] = tween;
    }
    return result;
  }, {});
  return {
    allIds,
    byId
  }
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

export const getTweenEventsWithArtboard = (store: LayerState, artboardId: string): { allIds: string[]; byId: { [id: string]: em.TweenEvent } } => {
  const eventsWithArtboardAsOrigin = getAllArtboardTweenEvents(store, artboardId);
  const eventsWithArtboardAsDestination = getTweensEventsByDestinationArtboard(store, artboardId);
  return {
    allIds: [...eventsWithArtboardAsOrigin.allIds, ...eventsWithArtboardAsDestination.allIds],
    byId: {
      ...eventsWithArtboardAsOrigin.byId,
      ...eventsWithArtboardAsDestination.byId
    }
  }
};

export const getTweensWithLayer = (store: LayerState, layerId: string): { allIds: string[]; byId: { [id: string]: em.Tween } } => {
  const allIds: string[] = [];
  const byId = store.allTweenIds.reduce((result: { [id: string]: em.Tween }, current) => {
    const tween = store.tweenById[current];
    if (tween.layer === layerId || tween.destinationLayer === layerId) {
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

export const getGradientOriginPoint = (id: string, origin: em.Point): paper.Point => {
  const paperLayer = getPaperLayer(id);
  return new paperMain.Point((origin.x * paperLayer.bounds.width) + paperLayer.position.x, (origin.y * paperLayer.bounds.height) + paperLayer.position.y);
};

export const getGradientDestinationPoint = (id: string, destination: em.Point): paper.Point => {
  const paperLayer = getPaperLayer(id);
  return new paperMain.Point((destination.x * paperLayer.bounds.width) + paperLayer.position.x, (destination.y * paperLayer.bounds.height) + paperLayer.position.y);
};

// export const getGradientStops = (stops: { [id: string]: em.GradientStop }): paper.GradientStop[] => {
//   return Object.keys(stops).reduce((result, current) => {
//     const stop = stops[current];
//     result = [
//       ...result,
//       new paperMain.GradientStop({ hue: stop.color.h, saturation: stop.color.s, lightness: stop.color.l, alpha: stop.color.a } as paper.Color, stop.position)
//     ];
//     return result;
//   }, []);
// };

export const getGradientStops = (stops: em.GradientStop[]): paper.GradientStop[] => {
  return stops.reduce((result, current) => {
    result = [
      ...result,
      new paperMain.GradientStop({ hue: current.color.h, saturation: current.color.s, lightness: current.color.l, alpha: current.color.a } as paper.Color, current.position)
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
};

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
};

export const orderLayersByLeft = (layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aPaperLayer = getPaperLayer(a);
    const bPaperLayer = getPaperLayer(b);
    return aPaperLayer.bounds.left - bPaperLayer.bounds.left;
  });
};

export const orderLayersByTop = (layers: string[]): string[] => {
  return [...layers].sort((a, b) => {
    const aPaperLayer = getPaperLayer(a);
    const bPaperLayer = getPaperLayer(b);
    return aPaperLayer.bounds.top - bPaperLayer.bounds.top;
  });
};

export const exportPaperProject = (state: LayerState): string => {
  const selectionFrame = paperMain.project.getItem({data: {id: 'selectionFrame'}});
  const hoverFrame = paperMain.project.getItem({data: {id: 'hoverFrame'}});
  const gradientFrame = paperMain.project.getItem({data: {id: 'gradientFrame'}});
  const activeArtboardFrame = paperMain.project.getItem({data: {id: 'activeArtboard'}});
  const measureFrame = paperMain.project.getItem({data: {id: 'measureFrame'}});
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
  if (measureFrame) {
    measureFrame.remove();
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
};

interface ImportPaperProject {
  documentImages: {
    [id: string]: em.DocumentImage;
  };
  paperProject: string;
  layers: {
    shape: string[];
    artboard: string[];
    text: string[];
    image: string[];
  };
}

export const importPaperProject = ({documentImages, paperProject, layers}: ImportPaperProject): void => {
  paperMain.project.clear();
  const newPaperProject = Object.keys(documentImages).reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(documentImages[current].buffer));
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
};

export const colorsMatch = (color1: em.Color, color2: em.Color): boolean => {
  return Object.keys(color1).every((prop: 'h' | 's' | 'l' | 'v' | 'a') => color1[prop] === color2[prop]);
};

export const gradientsMatch = (gradient1: em.Gradient, gradient2: em.Gradient): boolean => {
  const gradientTypesMatch = gradient1.gradientType === gradient2.gradientType;
  const originsMatch = gradient1.origin.x === gradient2.origin.x && gradient1.origin.y === gradient2.origin.y;
  const destinationsMatch = gradient1.destination.x === gradient2.destination.x && gradient1.destination.y === gradient2.destination.y;
  const g1SortedStops = [...gradient1.stops].sort((a,b) => { return a.position - b.position });
  const g2SortedStops = [...gradient2.stops].sort((a,b) => { return a.position - b.position });
  const stopsMatch = g1SortedStops.every((id, index) => {
    const g1Stop = g1SortedStops[index];
    const g2Stop = g2SortedStops[index];
    const stopColorsMatch = colorsMatch(g1Stop.color, g2Stop.color);
    const stopPositionsMatch = g1Stop.position === g2Stop.position;
    return stopColorsMatch && stopPositionsMatch;
  });
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

export const getCurvePoints = (paperLayer: paper.Path | paper.CompoundPath): em.CurvePoint[] => {
  const curvePoints: em.CurvePoint[] = [];
  const newPoint = (segment: paper.Segment) => {
    curvePoints.push({
      point: {
        x: segment.point.x,
        y: segment.point.y
      },
      handleIn: {
        x: segment.handleIn.x,
        y: segment.handleIn.y
      },
      handleOut: {
        x: segment.handleOut.x,
        y: segment.handleOut.y
      }
    });
  }
  switch(paperLayer.className) {
    case 'Path':
      (paperLayer as paper.Path).segments.forEach((segment) => {
        newPoint(segment);
      });
      break;
    case 'CompoundPath': {
      const compoundPaths: paper.CompoundPath[] = [paperLayer as paper.CompoundPath];
      let i = 0;
      while(i < compoundPaths.length) {
        const compoundPath = compoundPaths[i];
        if (compoundPath.children) {
          compoundPath.children.forEach((child) => {
            if (child.className === 'CompoundPath') {
              compoundPaths.push(child as paper.CompoundPath);
            } else {
              (child as paper.Path).segments.forEach((segment) => {
                newPoint(segment);
              });
            }
          });
        }
        i++;
      }
      break;
    }
  }
  return curvePoints;
}

export const getArtboardsTopTop = (state: LayerState): number => {
  const artboards = state.allArtboardIds;
  return artboards.reduce((result: number, current: string) => {
    const paperLayer = getPaperLayer(current);
    if (paperLayer.bounds.top < result) {
      result = paperLayer.bounds.top;
    }
    return result;
  }, getPaperLayer(artboards[0]).bounds.top);
};