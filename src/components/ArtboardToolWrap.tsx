import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ArtboardTool from './ArtboardTool';

interface ArtboardToolWrapProps {
  isEnabled?: boolean;
}

const ArtboardToolWrap = (props: ArtboardToolWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <ArtboardTool />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { artboardTool } = state;
  const isEnabled = artboardTool.isEnabled;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(ArtboardToolWrap);