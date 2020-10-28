import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface SubtractButtonProps {
  canSubtract: boolean;
  applyBooleanOperationThunk(booleanOperation: Btwx.BooleanOperation): void;
}

const SubtractButton = (props: SubtractButtonProps): ReactElement => {
  const { canSubtract, applyBooleanOperationThunk } = props;

  const handleSubtractClick = (): void => {
    if (canSubtract) {
      applyBooleanOperationThunk('subtract');
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
  canSubtract: boolean;
} => {
  const canSubtract = canBooleanSelected(state);
  return { canSubtract };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(SubtractButton);