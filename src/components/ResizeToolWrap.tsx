import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ResizeTool from './ResizeTool';

interface ResizeToolWrapProps {
  isEnabled?: boolean;
}

const ResizeToolWrap = (props: ResizeToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <ResizeTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { resizeTool } = state;
  const isEnabled = resizeTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(ResizeToolWrap);