import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { DistributeLayersVerticallyPayload, LayerTypes } from '../store/actionTypes/layer';
import { distributeLayersVertically } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface DistributeVerticallyToggleProps {
  selected?: string[];
  distributeLayersVertically?(payload: DistributeLayersVerticallyPayload): LayerTypes;
}

const DistributeVerticallyToggle = (props: DistributeVerticallyToggleProps): ReactElement => {
  const { selected, distributeLayersVertically } = props;

  return (
    <IconButton
      onClick={() => distributeLayersVertically({layers: selected})}
      icon={Icon('distribute-vertically')}
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
  { distributeLayersVertically }
)(DistributeVerticallyToggle);