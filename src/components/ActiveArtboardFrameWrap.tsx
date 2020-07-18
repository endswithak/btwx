import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ActiveArtboardFrame from './ActiveArtboardFrame';

interface ActiveArtboardFrameWrapProps {
  activeArtboard?: string;
}

const ActiveArtboardFrameWrap = (props: ActiveArtboardFrameWrapProps): ReactElement => {
  const { activeArtboard } = props;

  return (
    activeArtboard
    ? <ActiveArtboardFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  return { activeArtboard };
};

export default connect(
  mapStateToProps
)(ActiveArtboardFrameWrap);