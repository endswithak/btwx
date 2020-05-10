import paper, { Shape, Point, Path, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import store, { StoreDispatch, StoreGetState } from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool, enableDragTool } from '../store/actions/tool';
import { addShape, setLayerHover, increaseLayerScope, selectLayer, newLayerScope, deselectLayer, moveLayerBy, moveLayersBy, enableLayerDrag, disableLayerDrag, deepSelectLayer } from '../store/actions/layer';
import { getNearestScopeAncestor, getLayerByPaperId, isScopeGroupLayer, getPaperLayer, getLayer } from '../store/selectors/layer';
import { updateHoverFrame, updateSelectionFrame } from '../store/utils/layer';

interface GetSymbolsPage {
  sketchPages: FileFormat.Page[];
}

export const getSymbolsPage = ({ sketchPages }: GetSymbolsPage) => {
  return sketchPages.find((page: FileFormat.Page) => {
    return page.layers.length > 0 && page.layers[0]._class === 'symbolMaster';
  });
};

export const base64ArrayBuffer = (arrayBuffer: any[]) => {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a, b, c, d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}

export const base64Image = (image: any) => {
  const base64 = base64ArrayBuffer(image);
  return `data:image/png;base64,${base64}`;
}

interface GetBase64Images {
  sketchImages: {
    [id: string]: Buffer;
  };
}

export const getBase64Images = ({sketchImages}: GetBase64Images) => {
  const images: { [id: string]: string } = {};
  Object.keys(sketchImages).forEach((key) => {
    images[key] = base64Image(sketchImages[key])
  });
  return images;
}

interface GetChildByName {
  layer: paper.Item;
  name: string;
}

export const getChildByName = ({layer, name}: GetChildByName): paper.Item => {
  return layer.children.find((child) => child.name === name);
}

interface GetLayerByPath {
  layer: paper.Layer | paper.Group;
  path: string;
}

export const getLayerByPath = ({layer, path}: GetLayerByPath): paper.Item => {
  const layers = path.split('/');
  let selectedLayer: paper.Item = layer;
  let i = 0;
  while(i < layers.length) {
    selectedLayer = getChildByName({layer: selectedLayer, name: layers[i]});
    i++;
  }
  return selectedLayer;
}

interface SetSelection {
  artboard: string;
  path: string;
  dispatch: any;
}

export const setSelection = ({artboard, path, dispatch}: SetSelection): void => {
  paper.project.selectedItems.forEach((selectedItem) => {
    selectedItem.remove();
  });
  const paperArtboard = paper.project.layers.find((layer) => layer.name === artboard)  as paper.Group;
  const paperArtboardLayers = getChildByName({layer: paperArtboard, name: 'layers'}) as paper.Group;
  const selectedLayer = getLayerByPath({layer: paperArtboardLayers, path: path});
  const selectionFrame = new Shape.Rectangle({
    name: 'selection-frame',
    size: [selectedLayer.data.frame.width, selectedLayer.data.frame.height],
    parent: selectedLayer
  });
  dispatch({
    type: 'set-selected-paper-layer',
    selectedPaperLayer: selectedLayer
  });
  selectionFrame.selected = true;
}

interface GetParent {
  item: paper.Item;
}

export const getParent = ({ item }: GetParent) => {
  if (item) {
    let currentItem = item;
    while(!currentItem.isGroup) {
      currentItem = currentItem.parent;
    }
    return currentItem.layersGroup();
  }
}