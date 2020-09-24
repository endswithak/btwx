import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { zoomOutThunk } from '../store/actions/zoomTool';
import TopbarButton from './TopbarButton';

interface ZoomOutButtonProps {
  zoomOutThunk?(): void;
  disabled?: boolean;
}

const ZoomOutButton = (props: ZoomOutButtonProps): ReactElement => {
  const { zoomOutThunk, disabled } = props;

  return (
    <TopbarButton
      hideLabel
      label='Zoom Out'
      onClick={zoomOutThunk}
      disabled={disabled}
      icon='zoom-out'
      />
  );
}

const mapStateToProps = (state: RootState): {
  disabled: boolean;
} => {
  const { documentSettings } = state;
  const disabled = documentSettings.matrix[0] === 0.01;
  return { disabled };
};

export default connect(
  mapStateToProps,
  { zoomOutThunk }
)(ZoomOutButton);