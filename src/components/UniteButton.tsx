import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { UniteLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface UniteButtonProps {
  selected: string[];
  canUnite: boolean;
  applyBooleanOperationThunk(payload: UniteLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const UniteButton = (props: UniteButtonProps): ReactElement => {
  const { selected, canUnite, applyBooleanOperationThunk } = props;

  const handleUniteClick = (): void => {
    if (canUnite) {
      applyBooleanOperationThunk({id: selected[0], unite: selected[1]}, 'unite');
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
  { applyBooleanOperationThunk }
)(UniteButton);