import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SendLayersForwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersForward } from '../store/actions/layer';
import { canBringForwardSelection } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface MoveForwardButtonProps {
  selected: string[];
  canMoveForward: boolean;
  sendLayersForward(payload: SendLayersForwardPayload): LayerTypes;
}

const MoveForwardButton = (props: MoveForwardButtonProps): ReactElement => {
  const { selected, canMoveForward, sendLayersForward } = props;

  const handleMoveForwardClick = (): void => {
    if (canMoveForward) {
      sendLayersForward({layers: selected});
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
  selected: string[];
  canMoveForward: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canMoveForward = canBringForwardSelection(layer.present);
  return { selected, canMoveForward };
};

export default connect(
  mapStateToProps,
  { sendLayersForward }
)(MoveForwardButton);