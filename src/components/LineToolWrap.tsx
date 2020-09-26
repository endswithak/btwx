import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import LineTool from './LineTool';

interface LineToolWrapProps {
  isEnabled?: boolean;
}

const LineToolWrap = (props: LineToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <LineTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { lineTool } = state;
  const isEnabled = lineTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(LineToolWrap);