import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { IntersectLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
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
      applyBooleanOperationThunk({layers: selected}, 'intersect');
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
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canIntersect = selection.canBoolean;
  return { selected, canIntersect };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(IntersectButton);