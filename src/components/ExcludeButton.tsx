import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface ExcludeButtonProps {
  canExclude?: boolean;
  applyBooleanOperationThunk?(booleanOperation: Btwx.BooleanOperation): void;
}

const ExcludeButton = (props: ExcludeButtonProps): ReactElement => {
  const { canExclude, applyBooleanOperationThunk } = props;

  const handleExcludeClick = (): void => {
    if (canExclude) {
      applyBooleanOperationThunk('exclude');
    }
  }

  return (
    <TopbarButton
      label='Difference'
      onClick={handleExcludeClick}
      icon='exclude'
      disabled={!canExclude} />
  );
}

const mapStateToProps = (state: RootState): {
  canExclude: boolean;
} => {
  const canExclude = canBooleanSelected(state);
  return { canExclude };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(ExcludeButton);