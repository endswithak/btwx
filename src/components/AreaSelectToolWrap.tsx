import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import AreaSelectTool from './AreaSelectTool';

interface AreaSelectToolWrapProps {
  isEnabled?: boolean;
}

const AreaSelectToolWrap = (props: AreaSelectToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <AreaSelectTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { areaSelectTool } = state;
  const isEnabled = areaSelectTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(AreaSelectToolWrap);