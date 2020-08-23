import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { AlignLayersToMiddlePayload, LayerTypes } from '../store/actionTypes/layer';
import { alignLayersToMiddle } from '../store/actions/layer';
import IconButton from './IconButton';

interface AlignMiddleToggleProps {
  selected?: string[];
  alignLayersToMiddle?(payload: AlignLayersToMiddlePayload): LayerTypes;
}

const AlignMiddleToggle = (props: AlignMiddleToggleProps): ReactElement => {
  const { selected, alignLayersToMiddle } = props;

  return (
    <IconButton
      onClick={() => alignLayersToMiddle({layers: selected})}
      icon='align-middle'
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
  { alignLayersToMiddle }
)(AlignMiddleToggle);