import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DistributeLayersHorizontallyPayload, LayerTypes } from '../store/actionTypes/layer';
import { distributeLayersHorizontally } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface DistributeHorizontallyToggleProps {
  selected?: string[];
  distributeLayersHorizontally?(payload: DistributeLayersHorizontallyPayload): LayerTypes;
}

const DistributeHorizontallyToggle = (props: DistributeHorizontallyToggleProps): ReactElement => {
  const { selected, distributeLayersHorizontally } = props;

  return (
    <IconButton
      onClick={() => distributeLayersHorizontally({layers: selected})}
      icon='distribute-horizontally'
      disabled={selected.length <= 2}
      variant='medium' />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  return { selected };
};

export default connect(
  mapStateToProps,
  { distributeLayersHorizontally }
)(DistributeHorizontallyToggle);