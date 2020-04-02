import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetLayerById {
  layer: FileFormat.Group;
  id: string;
}

export const getLayerById = ({layer, id}: GetLayerById): FileFormat.AnyLayer => {
  return layer.layers.find((layer) => layer.do_objectID === id);
}

interface GetLayerByPath {
  layer: FileFormat.AnyLayer;
  path: string;
}

interface GetLayerByPathReturnValue {
  layer: FileFormat.AnyLayer;
  absPosition: {
    x: number;
    y: number;
  }
}

export const getAbsLayerByPath = ({layer, path}: GetLayerByPath): GetLayerByPathReturnValue => {
  const layers = path.split('/');
  let selectedLayer: FileFormat.AnyLayer = layer;
  let absPosition: {x: number; y: number} = {x: 0, y: 0};
  let i = 0;
  while(i < layers.length) {
    selectedLayer = getLayerById({layer: (selectedLayer as FileFormat.Group), id: layers[i]});
    absPosition = {x: absPosition.x + selectedLayer.frame.x, y: absPosition.y + selectedLayer.frame.y};
    i++;
  }
  return {
    layer: selectedLayer,
    absPosition: absPosition
  };
}