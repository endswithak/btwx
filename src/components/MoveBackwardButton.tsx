import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SendLayersBackwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersBackward } from '../store/actions/layer';
import { canSendBackwardSelection } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface MoveBackwardButtonProps {
  selected: string[];
  canMoveBackward: boolean;
  sendLayersBackward(payload: SendLayersBackwardPayload): LayerTypes;
}

const MoveBackwardButton = (props: MoveBackwardButtonProps): ReactElement => {
  const { selected, canMoveBackward, sendLayersBackward } = props;

  const handleMoveBackwardClick = (): void => {
    if (canMoveBackward) {
      sendLayersBackward({layers: selected});
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
  selected: string[];
  canMoveBackward: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canMoveBackward = canSendBackwardSelection(layer.present);
  return { selected, canMoveBackward };
};

export default connect(
  mapStateToProps,
  { sendLayersBackward }
)(MoveBackwardButton);