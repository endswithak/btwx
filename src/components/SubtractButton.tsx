import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { SubtractLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { subtractLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import { orderLayersByDepth } from '../store/selectors/layer';

interface SubtractButtonProps {
  selected: string[];
  canSubtract: boolean;
  subtractLayers(payload: SubtractLayersPayload): LayerTypes;
}

const SubtractButton = (props: SubtractButtonProps): ReactElement => {
  const { selected, canSubtract, subtractLayers } = props;

  const handleSubtractClick = (): void => {
    if (canSubtract) {
      subtractLayers({id: selected[0], subtract: selected[1]});
    }
  }

  return (
    <TopbarButton
      label='Subtract'
      onClick={handleSubtractClick}
      icon='M7,9.001 L7,17 L7,17 L15,17 L15,21 L3.001,21 C3.00044772,21 3,20.9995523 3,20.999 L3,9 L3,9 L6.999,9 C6.99955228,9 7,9.00044772 7,9.001 Z'
      iconOpacity='M9,3 L21,3.001 L21,15 L9.001,14.9990001 C9.00044775,14.999 9.00000008,14.9985523 9,14.998 L9,3 L9,3 Z'
      disabled={!canSubtract} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canSubtract: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canSubtract = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).path.closed;
  });
  return { selected, canSubtract };
};

export default connect(
  mapStateToProps,
  { subtractLayers }
)(SubtractButton);