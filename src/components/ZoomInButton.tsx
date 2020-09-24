import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { zoomInThunk } from '../store/actions/zoomTool';
import TopbarButton from './TopbarButton';

interface ZoomInButtonProps {
  zoomInThunk?(): void;
}

const ZoomInButton = (props: ZoomInButtonProps): ReactElement => {
  const { zoomInThunk } = props;

  return (
    <TopbarButton
      hideLabel
      label='Zoom In'
      onClick={zoomInThunk}
      icon='zoom-in'
      />
  );
}

export default connect(
  null,
  { zoomInThunk }
)(ZoomInButton);