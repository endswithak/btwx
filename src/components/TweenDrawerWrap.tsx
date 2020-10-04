import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TweenDrawer from './TweenDrawer';

interface TweenDrawerWrapProps {
  ready: boolean;
  isOpen?: boolean;
}

const TweenDrawerWrap = (props: TweenDrawerWrapProps): ReactElement => {
  const { ready, isOpen } = props;

  return (
    isOpen
    ? <TweenDrawer ready={ready} />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isOpen: boolean;
} => {
  const { viewSettings } = state;
  const isOpen = viewSettings.tweenDrawer.isOpen;
  return { isOpen };
};

export default connect(
  mapStateToProps
)(TweenDrawerWrap);