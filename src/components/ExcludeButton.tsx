import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { ExcludeLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { excludeLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import { orderLayersByDepth } from '../store/selectors/layer';

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
      icon='M7,9 L7,17 L15,17 L15,21 L3,21 L3,9 L7,9 Z M21,3.001 L21,15 L21,15 L17,15 L17,7 L9,7 L9,3 L20.999,3 C20.9995523,3 21,3.00044772 21,3.001 Z'
      iconOpacity='M9,9 L14.999,9.00099983 C14.9995522,9.00100009 14.9999998,9.00144778 15,9.002 L15,15 L15,15 L9,14.999 L9,9 Z'
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