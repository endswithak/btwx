import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface UniteButtonProps {
  canUnite: boolean;
  applyBooleanOperationThunk(booleanOperation: Btwx.BooleanOperation): void;
}

const UniteButton = (props: UniteButtonProps): ReactElement => {
  const { canUnite, applyBooleanOperationThunk } = props;

  const handleUniteClick = (): void => {
    if (canUnite) {
      applyBooleanOperationThunk('unite');
    }
  }

  return (
    <TopbarButton
      label='Union'
      onClick={handleUniteClick}
      icon='unite'
      disabled={!canUnite} />
  );
}

const mapStateToProps = (state: RootState): {
  canUnite: boolean;
} => {
  const canUnite = canBooleanSelected(state);
  return { canUnite };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(UniteButton);