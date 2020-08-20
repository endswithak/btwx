import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { UngroupLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { ungroupLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';
import Icon from './Icon';

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
      icon={Icon('ungroup')}
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