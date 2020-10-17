import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { GroupLayersPayload } from '../store/actionTypes/layer';
import { groupLayersThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface GroupButtonProps {
  selected: string[];
  canGroup: boolean;
  groupLayersThunk(payload: GroupLayersPayload): void;
}

const GroupButton = (props: GroupButtonProps): ReactElement => {
  const { selected, canGroup, groupLayersThunk } = props;

  const handleGroupClick = () => {
    if (canGroup) {
      groupLayersThunk({layers: selected});
    }
  }

  return (
    <TopbarButton
      label='Group'
      onClick={handleGroupClick}
      icon='group'
      disabled={!canGroup} />
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  canGroup: boolean;
} => {
  const { layer, selection } = state;
  const selected = layer.present.selected;
  const canGroup = selection.canGroup;
  return { selected, canGroup };
};

export default connect(
  mapStateToProps,
  { groupLayersThunk }
)(GroupButton);