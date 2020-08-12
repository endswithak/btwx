import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { UniteLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { uniteLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import { orderLayersByDepth } from '../store/selectors/layer';

interface UniteButtonProps {
  selected: string[];
  canUnite: boolean;
  uniteLayers(payload: UniteLayersPayload): LayerTypes;
}

const UniteButton = (props: UniteButtonProps): ReactElement => {
  const { selected, canUnite, uniteLayers } = props;

  const handleUniteClick = (): void => {
    if (canUnite) {
      uniteLayers({id: selected[0], unite: selected[1]});
    }
  }

  return (
    <TopbarButton
      label='Unite'
      onClick={handleUniteClick}
      icon='M21,3 L21,15 L15,15 L15,21 L3,21 L3,9 L9,9 L9,3 L21,3 Z'
      disabled={!canUnite} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canUnite: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canUnite = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).path.closed;
  });
  return { selected, canUnite };
};

export default connect(
  mapStateToProps,
  { uniteLayers }
)(UniteButton);