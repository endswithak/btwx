import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AddLayersMaskPayload } from '../store/actionTypes/layer';
import { addLayersMaskThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface MaskButtonProps {
  canMask?: boolean;
  selected?: string[];
  addLayersMaskThunk?(payload: AddLayersMaskPayload): void;
}

const MaskButton = (props: MaskButtonProps): ReactElement => {
  const { canMask, selected, addLayersMaskThunk } = props;

  const handleMaskClick = (): void => {
    if (canMask) {
      addLayersMaskThunk({layers: selected});
    }
  }

  return (
    <TopbarButton
      label='Mask'
      onClick={handleMaskClick}
      icon='mask'
      disabled={!canMask} />
  );
}

const mapStateToProps = (state: RootState): {
  canMask?: boolean;
  selected?: string[];
} => {
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canMask = selection.canMask;
  return { selected, canMask };
};

export default connect(
  mapStateToProps,
  { addLayersMaskThunk }
)(MaskButton);