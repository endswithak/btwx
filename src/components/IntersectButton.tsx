import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { IntersectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { intersectLayers } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('intersect')}
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