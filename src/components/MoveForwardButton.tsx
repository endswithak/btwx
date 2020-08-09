import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { SendLayersForwardPayload, LayerTypes } from '../store/actionTypes/layer';
import { sendLayersForward } from '../store/actions/layer';
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
      icon='M11.5,20 L7.62371165,15.5586636 L8.37628835,14.900159 L11.0002883,17.8997074 L11,8.00029613 L4,8 L4,4 L19,4 L19,8 L12,8.00029613 L12.0002883,17.8997074 L14.6237117,14.900159 L15.3762883,15.5586636 L11.5,20 Z M13,13 L13,10 L19,10 L19,13 L13,13 Z M4,13 L4,10 L10,10 L10,13 L4,13 Z'
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