import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ExcludeLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { excludeLayers } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface ExcludeButtonProps {
  selected: string[];
  canExclude: boolean;
  excludeLayers(payload: ExcludeLayersPayload): LayerTypes;
}

const ExcludeButton = (props: ExcludeButtonProps): ReactElement => {
  const { selected, canExclude, excludeLayers } = props;

  const handleExcludeClick = (): void => {
    if (canExclude) {
      excludeLayers({id: selected[0], exclude: selected[1]});
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
    return layer.type === 'Shape' && (layer as em.Shape).path.closed;
  });
  return { selected, canExclude };
};

export default connect(
  mapStateToProps,
  { excludeLayers }
)(ExcludeButton);