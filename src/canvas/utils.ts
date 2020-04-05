import paper, { Shape, Point, Path, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

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

interface GetDrawingMetrics {
  to: paper.Point;
  from: paper.Point;
}

interface DrawingMetrics {
  diff: {
    x: number;
    y: number;
  };
  dims: {
    width: number;
    height: number;
    max: number;
  };
  constrain: {
    x: number;
    y: number;
  };
  center: {
    x: number;
    y: number;
  };
}

export const getDrawingMetrics = ({to, from}: GetDrawingMetrics): DrawingMetrics => {
  const diff = {
    x: to.x - from.x,
    y: to.y - from.y
  };
  const width = diff.x < 0 ? diff.x * -1 : diff.x;
  const height = diff.y < 0 ? diff.y * -1 : diff.y;
  const max = Math.max(width, height);
  const constrain = {
    x: diff.x < 0 ? from.x - max : from.x + max,
    y: diff.y < 0 ? from.y - max : from.y + max
  }
  const center = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2
  }
  return {
    diff,
    constrain,
    center,
    dims: {
      width,
      height,
      max
    }
  }
};

interface RenderDrawingShape {
  shape: 'rectangle' | 'ellipse' | 'rounded' | 'polygon' | 'star';
  to: paper.Point;
  from: paper.Point;
  shiftModifier: boolean;
  shapeOpts?: any;
}

export const renderDrawingShape = ({shape, to, from, shiftModifier, shapeOpts}: RenderDrawingShape) => {
  const metrics = getDrawingMetrics({to, from});
  switch(shape) {
    case 'rectangle':
      return new Path.Rectangle({
        from: from,
        to: shiftModifier ? new Point(metrics.constrain.x, metrics.constrain.y) : to,
        ...shapeOpts
      });
    case 'ellipse':
      return new Path.Ellipse({
        from: from,
        to: shiftModifier ? new Point(metrics.constrain.x, metrics.constrain.y) : to,
        ...shapeOpts
      });
    case 'rounded':
      return new Path.Rectangle({
        from: from,
        to: shiftModifier ? new Point(metrics.constrain.x, metrics.constrain.y) : to,
        radius: 8,
        ...shapeOpts
      });
    case 'polygon':
      return new Path.RegularPolygon({
        center: new Point(metrics.center.x, metrics.center.y),
        radius: metrics.dims.max / 2,
        sides: 5,
        ...shapeOpts
      });
    case 'star':
      return new Path.Star({
        center: new Point(metrics.center.x, metrics.center.y),
        radius1: metrics.dims.max / 2,
        radius2: (metrics.dims.max / 2) / 2,
        points: 5,
        ...shapeOpts
      });
  }
}

interface RenderDrawingTooltip {
  to: paper.Point;
  from: paper.Point;
  shiftModifier: boolean;
  zoom: number;
}

export const renderDrawingTooltip = ({ to, from, shiftModifier, zoom }: RenderDrawingTooltip) => {
  const metrics = getDrawingMetrics({to, from});
  return new PointText({
    point: [to.x + (30 / zoom), to.y + (30 / zoom)],
    content: `${Math.round(shiftModifier ? metrics.dims.max : metrics.dims.width)} x ${Math.round(shiftModifier ? metrics.dims.max : metrics.dims.height)}`,
    fillColor: 'white',
    fontFamily: 'Space Mono',
    fontSize: 12 / zoom
  });
}