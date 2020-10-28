import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { bringSelectedForwardThunk } from '../store/actions/layer';
import { canBringSelectedForward } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface MoveForwardButtonProps {
  canMoveForward: boolean;
  bringSelectedForwardThunk(): void;
}

const MoveForwardButton = (props: MoveForwardButtonProps): ReactElement => {
  const { canMoveForward, bringSelectedForwardThunk } = props;

  const handleMoveForwardClick = (): void => {
    if (canMoveForward) {
      bringSelectedForwardThunk();
    }
  }

  return (
    <TopbarButton
      label='Forward'
      onClick={handleMoveForwardClick}
      icon='move-forward'
      disabled={!canMoveForward} />
  );
}

const mapStateToProps = (state: RootState): {
  canMoveForward: boolean;
} => {
  const canMoveForward = canBringSelectedForward(state);
  return { canMoveForward };
};

export default connect(
  mapStateToProps,
  { bringSelectedForwardThunk }
)(MoveForwardButton);