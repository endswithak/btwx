import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { IntersectLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { orderLayersByDepth, canBooleanOperationSelection } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface IntersectButtonProps {
  selected: string[];
  canIntersect: boolean;
  applyBooleanOperationThunk(payload: IntersectLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const IntersectButton = (props: IntersectButtonProps): ReactElement => {
  const { selected, canIntersect, applyBooleanOperationThunk } = props;

  const handleIntersectClick = (): void => {
    if (canIntersect) {
      applyBooleanOperationThunk({id: selected[0], intersect: selected[1]}, 'intersect');
    }
  }

  return (
    <TopbarButton
      label='Intersect'
      onClick={handleIntersectClick}
      icon='intersect'
      disabled={!canIntersect} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canIntersect: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canIntersect = canBooleanOperationSelection(state.layer.present);
  return { selected, canIntersect };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(IntersectButton);