import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { IntersectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { intersectLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import { orderLayersByDepth } from '../store/selectors/layer';

interface IntersectButtonProps {
  selected: string[];
  canIntersect: boolean;
  intersectLayers(payload: IntersectLayersPayload): LayerTypes;
}

const IntersectButton = (props: IntersectButtonProps): ReactElement => {
  const { selected, canIntersect, intersectLayers } = props;

  const handleIntersectClick = (): void => {
    if (canIntersect) {
      intersectLayers({id: selected[0], intersect: selected[1]});
    }
  }

  return (
    <TopbarButton
      label='Intersect'
      onClick={handleIntersectClick}
      icon='M9,9 L15,9.001 L15,15 L9.001,14.9990002 C9.00044778,14.9989999 9.00000017,14.9985522 9,14.998 L9,9 L9,9 Z'
      iconOpacity='M7,9 L7,17 L15,17 L15,21 L3.001,21 C3.00044772,21 3,20.9995523 3,20.999 L3,9 L3,9 L7,9 Z M21,3 L21,15 L17,15 L17,7 L9,7 L9,3 L21,3 Z'
      disabled={!canIntersect} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canIntersect: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canIntersect = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).path.closed;
  });
  return { selected, canIntersect };
};

export default connect(
  mapStateToProps,
  { intersectLayers }
)(IntersectButton);