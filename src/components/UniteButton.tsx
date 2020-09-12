import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { UniteLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { uniteLayers } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

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
      icon='unite'
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
    return layer.type === 'Shape' && (layer as em.Shape).shapeType !== 'Line';
  });
  return { selected, canUnite };
};

export default connect(
  mapStateToProps,
  { uniteLayers }
)(UniteButton);