import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { addSelectionMaskThunk } from '../store/actions/layer';
import { canMaskSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface MaskButtonProps {
  canMask?: boolean;
  addSelectionMaskThunk?(): void;
}

const MaskButton = (props: MaskButtonProps): ReactElement => {
  const { canMask, addSelectionMaskThunk } = props;

  const handleMaskClick = (): void => {
    if (canMask) {
      addSelectionMaskThunk();
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
  const canMask = canMaskSelected(state);
  return { canMask };
};

export default connect(
  mapStateToProps,
  { addSelectionMaskThunk }
)(MaskButton);