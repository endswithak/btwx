import React, { ReactElement, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { getLayerById } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import CanvasArtboardLayer from './CanvasArtboardLayer';
import CanvasCompoundShapeLayer from './CanvasCompoundShapeLayer';
import CanvasShapeLayer from './CanvasShapeLayer';
import CanvasTextLayer from './CanvasTextLayer';
import CanvasImageLayer from './CanvasImageLayer';
import CanvasGroupLayer from './CanvasGroupLayer';

interface CanvasLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  eventTimelines?: {
    [id: string]: GSAPTimeline;
  };
  nestedScrollLeft?: number;
  nestedScrollTop?: number;
  wheelEvent?: any;
  nestedSubPathFlag?: string;
  deepestSubPath?: string;
  setNestedSubPathFlag?(subPathFlag: string): void;
  setNestedBoolFlag?(boolFlag: string): void;
  setNestedSubCompoundPathFlag?(nestedSubCompoundPathFlag: string): void;
}

const getLayerByIdSelector = () => getLayerById;

const CanvasLayer = (props: CanvasLayerProps): ReactElement => {
  const layerItemSelector: any = useMemo(getLayerByIdSelector, []);
  const layerItem = useSelector((state: RootState) => layerItemSelector(state, props.id), shallowEqual);

  if (layerItem) {
    switch(layerItem.type) {
      case 'Artboard':
        return (
          <CanvasArtboardLayer
            {...props} />
        );
      case 'Group':
        return (
          <CanvasGroupLayer
            {...props} />
        );
      case 'Image':
        return (
          <CanvasImageLayer
            {...props} />
        );
      case 'Shape':
        return (
          <CanvasShapeLayer
            {...props} />
        );
      case 'CompoundShape':
        return (
          <CanvasCompoundShapeLayer
            {...props} />
        );
      case 'Text':
        return (
          <CanvasTextLayer
            {...props} />
        );
    }
  } else {
    return null;
  }
};

export default CanvasLayer;