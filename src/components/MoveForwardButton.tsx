import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SendLayersForwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersForward } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('move-forward')}
      disabled={!canMoveForward} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canMoveForward: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canMoveForward = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    const isMask = layer.mask;
    return parent.children[parent.children.length - 1] === id || isMask;
  });
  return { selected, canMoveForward };
};

export default connect(
  mapStateToProps,
  { sendLayersForward }
)(MoveForwardButton);