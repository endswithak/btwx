import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { groupSelectedThunk } from '../store/actions/layer';
import { canGroupSelected } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface GroupButtonProps {
  canGroup: boolean;
  groupSelectedThunk(): void;
}

const GroupButton = (props: GroupButtonProps): ReactElement => {
  const { canGroup, groupSelectedThunk } = props;

  const handleGroupClick = () => {
    if (canGroup) {
      groupSelectedThunk();
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
  canGroup: boolean;
} => {
  const canGroup = canGroupSelected(state);
  return { canGroup };
};

export default connect(
  mapStateToProps,
  { groupSelectedThunk }
)(GroupButton);