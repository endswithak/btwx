import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { GroupLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { groupLayers } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface GroupButtonProps {
  selected: string[];
  canGroup: boolean;
  groupLayers(payload: GroupLayersPayload): LayerTypes;
}

const GroupButton = (props: GroupButtonProps): ReactElement => {
  const { selected, canGroup, groupLayers } = props;

  const handleGroupClick = () => {
    if (canGroup) {
      groupLayers({layers: selected});
    }
  }

  return (
    <TopbarButton
      label='Group'
      onClick={handleGroupClick}
      icon='M5,2 L5,3 L19,3 L19,2 L22,2 L22,5 L21,5 L21,19 L22,19 L22,22 L19,22 L19,21 L5,21 L5,22 L2,22 L2,19 L3,19 L3,5 L2,5 L2,2 L5,2 Z M19,4 L5,4 L5,5 L4,5 L4,19 L5,19 L5,20 L19,20 L19,19 L20,19 L20,5 L19,5 L19,4 Z M17,10 L17,17 L10,17 L10,10 L17,10 Z M14,7 L14,9 L9,9 L9,14 L7,14 L7,7 L14,7 Z'
      disabled={!canGroup} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canGroup: boolean;
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const canGroup = selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Artboard';
  });
  return { selected, canGroup };
};

export default connect(
  mapStateToProps,
  { groupLayers }
)(GroupButton);