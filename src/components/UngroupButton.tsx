import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canUngroupSelected } from '../store/selectors/layer';
import { ungroupSelectedThunk } from '../store/actions/layer';
import TopbarButton from './TopbarButton';

interface UngroupButtonProps {
  canUngroup: boolean;
  ungroupSelectedThunk(): void;
}

const UngroupButton = (props: UngroupButtonProps): ReactElement => {
  const { canUngroup, ungroupSelectedThunk } = props;

  const handleUngroupClick = (): void => {
    if (canUngroup) {
      ungroupSelectedThunk();
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
  canUngroup: boolean;
} => {
  const canUngroup = canUngroupSelected(state);
  return { canUngroup };
};

export default connect(
  mapStateToProps,
  { ungroupSelectedThunk }
)(UngroupButton);