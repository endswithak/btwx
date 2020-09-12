import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { IntersectLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
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
  const canIntersect = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).shapeType !== 'Line';
  });
  return { selected, canIntersect };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(IntersectButton);