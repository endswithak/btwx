import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ExcludeLayersPayload } from '../store/actionTypes/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface ExcludeButtonProps {
  selected: string[];
  canExclude: boolean;
  applyBooleanOperationThunk(payload: ExcludeLayersPayload, booleanOperation: em.BooleanOperation): void;
}

const ExcludeButton = (props: ExcludeButtonProps): ReactElement => {
  const { selected, canExclude, applyBooleanOperationThunk } = props;

  const handleExcludeClick = (): void => {
    if (canExclude) {
      applyBooleanOperationThunk({id: selected[0], exclude: selected[1]}, 'exclude');
    }
  }

  return (
    <TopbarButton
      label='Exclude'
      onClick={handleExcludeClick}
      icon='exclude'
      disabled={!canExclude} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canExclude: boolean;
} => {
  const { layer } = state;
  const selected = orderLayersByDepth(state.layer.present, layer.present.selected);
  const canExclude = selected.length === 2 && layer.present.selected.every((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Shape' && (layer as em.Shape).shapeType !== 'Line';
  });
  return { selected, canExclude };
};

export default connect(
  mapStateToProps,
  { applyBooleanOperationThunk }
)(ExcludeButton);