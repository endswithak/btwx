import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
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
      icon='M11.5,4 L15.3762883,8.44133642 L14.6237117,9.09984103 L11.9997117,6.10029259 L12,15.9997039 L19,16 L19,20 L4,20 L4,16 L11,15.9997039 L10.9997117,6.10029259 L8.37628835,9.09984103 L7.62371165,8.44133642 L11.5,4 Z M10,11 L10,14 L4,14 L4,11 L10,11 Z M19,11 L19,14 L13,14 L13,11 L19,11 Z'
      disabled={!canMoveBackward} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canMoveBackward: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canMoveBackward = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    return parent.children[0] === id;
  });
  return { selected, canMoveBackward };
};

export default connect(
  mapStateToProps,
  { sendLayersBackward }
)(MoveBackwardButton);