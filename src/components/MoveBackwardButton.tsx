import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canSendSelectedBackward } from '../store/selectors/layer';
import { sendSelectedBackwardThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface MoveBackwardButtonProps {
  canMoveBackward: boolean;
  sendSelectedBackwardThunk(): void;
}

const MoveBackwardButton = (props: MoveBackwardButtonProps): ReactElement => {
  const { canMoveBackward, sendSelectedBackwardThunk } = props;

  const handleMoveBackwardClick = (): void => {
    if (canMoveBackward) {
      sendSelectedBackwardThunk();
    }
  }

  return (
    <TopbarButton
      label='Backward'
      onClick={handleMoveBackwardClick}
      icon='move-backward'
      disabled={!canMoveBackward} />
  );
}

const mapStateToProps = (state: RootState): {
  canMoveBackward: boolean;
} => {
  const canMoveBackward = canSendSelectedBackward(state);
  return { canMoveBackward };
};

export default connect(
  mapStateToProps,
  { sendSelectedBackwardThunk }
)(MoveBackwardButton);