import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToRightPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToRight } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface AlignRightToggleProps {
  selected?: string[];
  alignLayersToRight?(payload: AlignLayersToRightPayload): LayerTypes;
}

const AlignRightToggle = (props: AlignRightToggleProps): ReactElement => {
  const { selected, alignLayersToRight } = props;

  return (
    <IconButton
      onClick={() => alignLayersToRight({layers: selected})}
      icon={Icon('align-right')}
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
  { alignLayersToRight }
)(AlignRightToggle);