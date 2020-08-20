import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToCenterPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToCenter } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface AlignCenterToggleProps {
  selected?: string[];
  alignLayersToCenter?(payload: AlignLayersToCenterPayload): LayerTypes;
}

const AlignCenterToggle = (props: AlignCenterToggleProps): ReactElement => {
  const { selected, alignLayersToCenter } = props;

  return (
    <IconButton
      onClick={() => alignLayersToCenter({layers: selected})}
      icon={Icon('align-center')}
      disabled={selected.length <= 1}
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
  { alignLayersToCenter }
)(AlignCenterToggle);