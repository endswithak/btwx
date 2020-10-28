import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface IntersectButtonProps {
  canIntersect: boolean;
  applyBooleanOperationThunk(booleanOperation: Btwx.BooleanOperation): void;
}

const IntersectButton = (props: IntersectButtonProps): ReactElement => {
  const { canIntersect, applyBooleanOperationThunk } = props;

  const handleIntersectClick = (): void => {
    if (canIntersect) {
      applyBooleanOperationThunk('intersect');
    }
  }

  return (
    <TopbarButton
      label='Intersect'
      onClick={handleIntersectClick}
      icon='intersect'
      disabled={!canIntersect} />
  );
}

const mapStateToProps = (state: RootState): {
  canIntersect: boolean;
} => {
  const canIntersect = canBooleanSelected(state);
  return { canIntersect };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(IntersectButton);