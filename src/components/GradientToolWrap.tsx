import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientTool from './GradientTool';

interface GradientToolWrapProps {
  isEnabled?: boolean;
}

const GradientToolWrap = (props: GradientToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <GradientTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { gradientTool } = state;
  const isEnabled = gradientTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(GradientToolWrap);