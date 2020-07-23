import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { UngroupLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { ungroupLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface UngroupButtonProps {
  selected: string[];
  canUngroup: boolean;
  ungroupLayers(payload: UngroupLayersPayload): LayerTypes;
}

const UngroupButton = (props: UngroupButtonProps): ReactElement => {
  const { selected, canUngroup, ungroupLayers } = props;

  const handleUngroupClick = (): void => {
    if (canUngroup) {
      ungroupLayers({layers: selected});
    }
  }

  return (
    <TopbarButton
      label='Ungroup'
      onClick={handleUngroupClick}
      icon='M13,11 L13,12 L18,12 L18,11 L20,11 L20,13 L19,13 L19,18 L20,18 L20,20 L18,20 L18,19 L13,19 L13,20 L11,20 L11,18 L12,18 L12,13 L11,13 L11,11 L13,11 Z M6,4 L6,5 L11,5 L11,4 L13,4 L13,6 L12,6 L12,10 L10,10 L10,12 L6,12 L6,13 L4,13 L4,11 L5,11 L5,6 L4,6 L4,4 L6,4 Z'
      disabled={!canUngroup} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canUngroup: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canUngroup = selected.length > 0 && layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Group';
  });
  return { selected, canUngroup };
};

export default connect(
  mapStateToProps,
  { ungroupLayers }
)(UngroupButton);