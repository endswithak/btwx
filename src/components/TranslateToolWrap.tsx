import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TranslateTool from './TranslateTool';

interface TranslateToolWrapProps {
  isEnabled?: boolean;
}

const TranslateToolWrap = (props: TranslateToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <TranslateTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { translateTool } = state;
  const isEnabled = translateTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(TranslateToolWrap);