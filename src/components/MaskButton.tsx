import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleSelectionMaskThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface MaskButtonProps {
  canMask?: boolean;
  toggleSelectionMaskThunk?(): void;
}

const MaskButton = (props: MaskButtonProps): ReactElement => {
  const { canMask, toggleSelectionMaskThunk } = props;

  const handleMaskClick = (): void => {
    if (canMask) {
      toggleSelectionMaskThunk();
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
} => {
  const { selection } = state;
  const canMask = selection.canToggleUseAsMask;
  return { canMask };
};

export default connect(
  mapStateToProps,
  { toggleSelectionMaskThunk }
)(MaskButton);