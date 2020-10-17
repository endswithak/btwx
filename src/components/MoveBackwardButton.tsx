import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SendLayersBackwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersBackward } from '../store/actions/layer';
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
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canMoveBackward = selection.canMoveBackward;
  return { selected, canMoveBackward };
};

export default connect(
  mapStateToProps,
  { sendLayersBackward }
)(MoveBackwardButton);