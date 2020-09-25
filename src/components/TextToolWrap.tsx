import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TextTool from './TextTool';

interface TextToolWrapProps {
  isEnabled?: boolean;
}

const TextToolWrap = (props: TextToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <TextTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { textTool } = state;
  const isEnabled = textTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(TextToolWrap);