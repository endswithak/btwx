import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SendLayersBackwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersBackward } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('move-backward')}
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
    const inMaskedGroup = parent.type === 'Group' && (parent as em.Group).clipped;
    const isFirstMaskChild = inMaskedGroup && parent.children[1] === id;
    return parent.children[0] === id || isFirstMaskChild;
  });
  return { selected, canMoveBackward };
};

export default connect(
  mapStateToProps,
  { sendLayersBackward }
)(MoveBackwardButton);