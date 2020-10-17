import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
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
      icon='ungroup'
      disabled={!canUngroup} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canUngroup: boolean;
} => {
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canUngroup = selection.canUngroup;
  return { selected, canUngroup };
};

export default connect(
  mapStateToProps,
  { ungroupLayers }
)(UngroupButton);