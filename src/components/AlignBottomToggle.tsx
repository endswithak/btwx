import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToBottomPayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToBottom } from '../store/actions/layer';
import IconButton from './IconButton';
import Icon from './Icon';

interface AlignBottomToggleProps {
  selected?: string[];
  alignLayersToBottom?(payload: AlignLayersToBottomPayload): LayerTypes;
}

const AlignBottomToggle = (props: AlignBottomToggleProps): ReactElement => {
  const { selected, alignLayersToBottom } = props;

  return (
    <IconButton
      onClick={() => alignLayersToBottom({layers: selected})}
      icon={Icon('align-bottom')}
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
  { alignLayersToBottom }
)(AlignBottomToggle);