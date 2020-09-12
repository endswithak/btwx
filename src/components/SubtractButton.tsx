import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SubtractLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface SubtractButtonProps {
  selected: string[];
  canSubtract: boolean;
  applyBooleanOperationThunk(payload: SubtractLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const SubtractButton = (props: SubtractButtonProps): ReactElement => {
  const { selected, canSubtract, applyBooleanOperationThunk } = props;

  const handleSubtractClick = (): void => {
    if (canSubtract) {
      applyBooleanOperationThunk({id: selected[0], subtract: selected[1]}, 'subtract');
    }
  }

  return (
    <TopbarButton
      label='Subtract'
      onClick={handleSubtractClick}
      icon='subtract'
      disabled={!canSubtract} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canSubtract: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canSubtract = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).shapeType !== 'Line';
  });
  return { selected, canSubtract };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(SubtractButton);