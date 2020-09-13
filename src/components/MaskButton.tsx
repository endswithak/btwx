import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AddLayersMaskPayload } from '../store/actionTypes/layer';
import { addLayersMaskThunk } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
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
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedById: {[id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text} = selected.reduce((result, current) => {
    result = {
      ...result,
      [current]: layer.present.byId[current]
    }
    return result;
  }, {});
  const selectedByDepth = orderLayersByDepth(state.layer.present, selected);
  const canMask = selected.length > 0 && selectedById[selectedByDepth[0]].type === 'Shape' && (selectedById[selectedByDepth[0]] as em.Shape).shapeType !== 'Line' && !(selectedById[selectedByDepth[0]] as em.Shape).mask;
  return { selected, canMask };
};

export default connect(
  mapStateToProps,
  { addLayersMaskThunk }
)(MaskButton);