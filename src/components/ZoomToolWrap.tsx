import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ZoomTool from './ZoomTool';

interface ZoomToolWrapProps {
  isEnabled?: boolean;
}

const ZoomToolWrap = (props: ZoomToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <ZoomTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { zoomTool } = state;
  const isEnabled = zoomTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(ZoomToolWrap);