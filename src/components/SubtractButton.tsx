import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SubtractLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanOperationSelection } from '../store/selectors/layer';
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
      applyBooleanOperationThunk({layers: selected}, 'subtract');
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
  const selected = layer.present.selected;
  const canSubtract = canBooleanOperationSelection(state.layer.present);
  return { selected, canSubtract };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(SubtractButton);